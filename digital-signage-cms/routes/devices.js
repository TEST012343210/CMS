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

const generateUniqueIdentifier = async () => {
  const lastDevice = await Device.findOne().sort({ identifier: -1 }).exec();
  let lastNumber = 0;

  if (lastDevice) {
    const match = lastDevice.identifier.match(/Display(\d+)/);
    if (match) {
      lastNumber = parseInt(match[1], 10);
    }
  }

  const newIdentifier = `Display${(lastNumber + 1).toString().padStart(4, '0')}`;
  return newIdentifier;
};

const checkLicenseLimit = async (clientId) => {
  const licenseLimit = 3; // Example limit, adjust accordingly
  const deviceCount = await Device.countDocuments({ clientId, approved: true });
  return deviceCount >= licenseLimit;
};

router.get('/register', async (req, res) => {
  const requestId = uuidv4();
  const requestIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const currentTime = Date.now();
  const clientId = req.query.clientId;

  if (!clientId) {
    return res.status(400).send('Client ID is required');
  }

  logWithTimestamp(`Received GET request to /register from IP: ${requestIp}`, requestId);

  if (currentTime - lastRequestTime < 1000) {
    logWithTimestamp('Registration in progress, request rejected due to rapid successive requests.', requestId);
    return res.status(429).send('Registration in progress, please try again.');
  }

  lastRequestTime = currentTime;

  lock.acquire(REGISTRATION_KEY, async (done) => {
    logWithTimestamp('Lock acquired for /register', requestId);
    try {
      if (await checkLicenseLimit(clientId)) {
        logWithTimestamp('License limit reached for client.', requestId);
        return res.status(403).send('License limit reached. Please purchase more licenses.');
      }

      const newIdentifier = await generateUniqueIdentifier();
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      logWithTimestamp(`Generated new identifier: ${newIdentifier}`, requestId);

      const device = new Device({
        clientId,
        name: 'Unnamed Device',
        identifier: newIdentifier,
        approved: false,
        code,
      });

      await device.save();
      logWithTimestamp(`Device registered with identifier: ${newIdentifier}`, requestId);
      res.json({ identifier: newIdentifier, code: device.code });
    } catch (err) {
      logWithTimestamp(`Error during GET /register: ${err.message}`, requestId);
      console.error('Stack trace:', err.stack);
      res.status(500).send('Server error');
    } finally {
      done();
      logWithTimestamp('Lock released for /register', requestId);
    }
  }, { timeout: 10000 });
});

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

// Get device by ID
router.get('/:id', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  const requestId = uuidv4();
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      logWithTimestamp(`Device not found: ${req.params.id}`, requestId);
      return res.status(404).json({ msg: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    logWithTimestamp(`Server error: ${err.message}`, requestId);
    res.status(500).send('Server error');
  }
});

// Approve device and optionally rename it
router.patch('/:id/approve', [auth, checkRole(['Admin'])], async (req, res) => {
  const requestId = uuidv4();
  const { name, locationId, code } = req.body;
  const clientId = req.body.clientId; // Ensure clientId is passed in the request body

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
    if (await checkLicenseLimit(clientId)) {
      logWithTimestamp('License limit reached for client.', requestId);
      return res.status(403).json({ msg: 'License limit reached. Please purchase more licenses.' });
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
    res.status(500).json({ msg: 'Server error' });
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

// Handle sssp_config.xml request
router.get('/register/sssp_config.xml', (req, res) => {
  const requestId = uuidv4();
  logWithTimestamp('Received GET request to /register/sssp_config.xml', requestId);
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <SamsungSmartSignagePlatform>
    <device>
      <name>Unnamed Device</name>
      <identifier>Display</identifier>
      <approved>false</approved>
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
      <identifier>TestDisplay</identifier>
      <approved:false</approved>
    </device>
  </SamsungSmartSignagePlatform>`);
});

module.exports = router;
