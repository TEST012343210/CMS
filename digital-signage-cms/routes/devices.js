const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const AsyncLock = require('async-lock');
const { v4: uuidv4 } = require('uuid');

const lock = new AsyncLock();
const REGISTRATION_KEY = 'register_device';
let lastRequestTime = 0;

const logWithTimestamp = (message, requestId) => {
  console.log(`[${new Date().toISOString()}] [${requestId}] ${message}`);
};

// Get all devices
router.get('/', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  const requestId = uuidv4();
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Get unapproved devices
router.get('/unapproved', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  const requestId = uuidv4();
  try {
    const devices = await Device.find({ approved: false });
    res.json(devices);
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Approve device and optionally rename it
router.patch('/:id/approve', [auth, checkRole(['Admin'])], async (req, res) => {
  const requestId = uuidv4();
  const { name, locationId, code } = req.body;

  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      logWithTimestamp(`Device not found: ${req.params.id}`, requestId);
      return res.status(404).json({ msg: 'Device not found' });
    }
    if (device.code !== code) {
      logWithTimestamp(`Incorrect code for device: ${req.params.id}`, requestId);
      return res.status(400).json({ msg: 'Incorrect code' });
    }
    if (name) {
      device.name = name;
    }
    if (locationId) {
      device.locationId = locationId;
    }
    device.approved = true;
    await device.save();
    res.json(device);
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Update device name and location ID
router.patch('/:id/details', [auth, checkRole(['Admin'])], async (req, res) => {
  const requestId = uuidv4();
  const { name, locationId } = req.body;

  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      logWithTimestamp(`Device not found: ${req.params.id}`, requestId);
      return res.status(404).json({ msg: 'Device not found' });
    }
    device.name = name;
    device.locationId = locationId;
    await device.save();
    res.json(device);
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Delete device
router.delete('/:id', [auth, checkRole(['Admin'])], async (req, res) => {
  const requestId = uuidv4();
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      logWithTimestamp(`Device not found: ${req.params.id}`, requestId);
      return res.status(404).json({ msg: 'Device not found' });
    }
    await device.deleteOne();
    res.json({ msg: 'Device removed' });
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Register Device via POST request
router.post('/register', async (req, res) => {
  const requestId = uuidv4();
  const { identifier } = req.body;

  try {
    let device = await Device.findOne({ identifier });
    if (device) {
      logWithTimestamp(`Device already registered: ${identifier}`, requestId);
      return res.status(400).json({ msg: 'Device already registered' });
    }

    const devicesCount = await Device.countDocuments();
    const newIdentifier = `Display${(devicesCount + 1).toString().padStart(4, '0')}`;

    device = new Device({
      name: 'Unnamed Device',
      identifier: newIdentifier,
      approved: false,
      code: Math.floor(100000 + Math.random() * 900000).toString(), // Generate 6-digit code
    });

    await device.save();
    logWithTimestamp(`Device registered with identifier: ${newIdentifier}`, requestId);
    res.json(device);
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Register Device via GET request (for URL Launcher)
router.get('/register', async (req, res) => {
  const requestId = uuidv4();
  const requestIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const currentTime = Date.now();

  logWithTimestamp(`Received GET request to /register from IP: ${requestIp}`, requestId);

  if (currentTime - lastRequestTime < 1000) {
    logWithTimestamp('Registration in progress, request rejected due to rapid successive requests.', requestId);
    return res.status(429).send('Registration in progress, please try again.');
  }

  lastRequestTime = currentTime;

  lock.acquire(REGISTRATION_KEY, async (done) => {
    logWithTimestamp('Lock acquired for /register', requestId);
    try {
      const devicesCount = await Device.countDocuments();
      const newIdentifier = `Display${(devicesCount + 1).toString().padStart(4, '0')}`;
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code

      logWithTimestamp(`Generated new identifier: ${newIdentifier}`, requestId);

      let device = await Device.findOne({ identifier: newIdentifier });
      if (!device) {
        device = new Device({
          name: 'Unnamed Device',
          identifier: newIdentifier,
          approved: false,
          code,
        });

        await device.save();
        logWithTimestamp(`Device registered with identifier: ${newIdentifier}`, requestId);
        res.json({ identifier: newIdentifier, code: code }); // Respond with JSON instead of HTML
      } else {
        logWithTimestamp('Device already registered', requestId);
        res.json({ identifier: device.identifier, code: device.code });
      }
    } catch (err) {
      logWithTimestamp(`Error during GET /register: ${err.message}`, requestId);
      res.status(500).send('Server error');
    } finally {
      done();
      logWithTimestamp('Lock released for /register', requestId);
    }
  }, (err, ret) => {
    if (err) {
      logWithTimestamp(`Lock error: ${err}`, requestId);
    }
  });
});

// Handle sssp_config.xml request
router.get('/register/sssp_config.xml', (req, res) => {
  const requestId = uuidv4();
  logWithTimestamp('Received GET request to /register/sssp_config.xml', requestId);
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <SamsungSmartSignagePlatform>
    <device>
      <name>Unnamed Device</name>
      <identifier>Display</identifier>
      <approved:false</approved>
    </device>
  </SamsungSmartSignagePlatform>`);
});

// Debug route to check if the XML route is being hit
router.get('/test/sssp_config.xml', (req, res) => {
  const requestId = uuidv4();
  logWithTimestamp('Received GET request to /test/sssp_config.xml', requestId);
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <SamsungSmartSignagePlatform>
    <device>
      <name>Test Device</name>
      <identifier:TestDisplay</identifier>
      <approved:false</approved>
    </device>
  </SamsungSmartSignagePlatform>`);
});

module.exports = router;
