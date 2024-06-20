const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

let registrationInProgress = false;

// Get all devices
router.get('/', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Get unapproved devices
router.get('/unapproved', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  try {
    const devices = await Device.find({ approved: false });
    res.json(devices);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Approve device and optionally rename it
router.patch('/:id/approve', [auth, checkRole(['Admin'])], async (req, res) => {
  const { name, locationId } = req.body;

  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
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
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Update device name and location ID
router.patch('/:id/details', [auth, checkRole(['Admin'])], async (req, res) => {
  const { name, locationId } = req.body;

  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
    }
    device.name = name;
    device.locationId = locationId;
    await device.save();
    res.json(device);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete device
router.delete('/:id', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
    }
    await device.deleteOne();
    res.json({ msg: 'Device removed' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Register Device via POST request
router.post('/register', async (req, res) => {
  const { identifier } = req.body;

  try {
    let device = await Device.findOne({ identifier });
    if (device) {
      return res.status(400).json({ msg: 'Device already registered' });
    }

    const devicesCount = await Device.countDocuments();
    const newIdentifier = `Display${(devicesCount + 1).toString().padStart(4, '0')}`;

    device = new Device({
      name: 'Unnamed Device',
      identifier: newIdentifier,
      approved: false,
    });

    await device.save();
    res.json(device);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Register Device via GET request (for URL Launcher)
router.get('/register', async (req, res) => {
  if (registrationInProgress) {
    console.log('Registration in progress, request rejected.');
    res.status(429).send('Registration in progress, please try again.');
    return;
  }

  registrationInProgress = true;
  console.log('Registration started.');

  try {
    const devicesCount = await Device.countDocuments();
    const newIdentifier = `Display${(devicesCount + 1).toString().padStart(4, '0')}`;

    console.log(`Generated new identifier: ${newIdentifier}`);

    let device = await Device.findOne({ identifier: newIdentifier });
    if (!device) {
      device = new Device({
        name: 'Unnamed Device',
        identifier: newIdentifier,
        approved: false,
      });

      await device.save();
      console.log(`Device registered with identifier: ${newIdentifier}`);
      res.send(`<html><body><h2>Device Registered</h2><p>Device Identifier: ${newIdentifier}</p></body></html>`);
    } else {
      console.log('Device already registered');
      res.send(`<html><body><h2>Device Already Registered</h2><p>Device Identifier: ${device.identifier}</p></body></html>`);
    }
  } catch (err) {
    console.error('Error during GET /register:', err.message);
    res.status(500).send('Server error');
  } finally {
    registrationInProgress = false;
    console.log('Registration completed.');
  }
});

// Handle sssp_config.xml request
router.get('/register/sssp_config.xml', (req, res) => {
  console.log('Received GET request to /register/sssp_config.xml');
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
  console.log('Received GET request to /test/sssp_config.xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <SamsungSmartSignagePlatform>
    <device>
      <name>Test Device</name>
      <identifier:TestDisplay</identifier>
      <approved>false</approved>
    </device>
  </SamsungSmartSignagePlatform>`);
});

module.exports = router;
