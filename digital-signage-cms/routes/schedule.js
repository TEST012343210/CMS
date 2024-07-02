const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const Schedule = require('../models/Schedule');
const Content = require('../models/Content');
const DynamicContent = require('../models/DynamicContent');
const axios = require('axios');
const evaluateRule = require('../services/ruleEngine');

// Create Schedule
router.post(
  '/',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('contentIds', 'Content IDs are required').isArray().optional({ nullable: true }),
      check('dynamicContentIds', 'Dynamic Content IDs are required').isArray().optional({ nullable: true }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contentIds = [], dynamicContentIds = [], rule } = req.body;

    try {
      // Validate content and dynamic content IDs
      const contents = await Content.find({ _id: { $in: contentIds } });
      const dynamicContents = await DynamicContent.find({ _id: { $in: dynamicContentIds } });

      if (contents.length !== contentIds.length || dynamicContents.length !== dynamicContentIds.length) {
        return res.status(400).json({ errors: [{ msg: 'Some content IDs are invalid.' }] });
      }

      const newSchedule = new Schedule({
        name,
        contents: contentIds,
        dynamicContent: dynamicContentIds,
        rule,
        user: req.user.id,
      });

      const schedule = await newSchedule.save();
      res.json(schedule);
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get All Schedules
router.get('/', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('contents dynamicContent').sort({ createdAt: -1 });

    const currentWeather = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: { key: process.env.WEATHER_API_KEY, q: 'London' }
    });

    const activeSchedules = schedules.filter(schedule => {
      if (schedule.rule) {
        return evaluateRule(schedule.rule, currentWeather.data);
      }
      return true;
    });

    res.json(activeSchedules);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    res.status(500).send('Server error');
  }
});

// Get Schedule by ID
router.get('/:id', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('contents dynamicContent');

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Schedule not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update Schedule
router.put(
  '/:id',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('contentIds', 'Content IDs are required').isArray().optional({ nullable: true }),
      check('dynamicContentIds', 'Dynamic Content IDs are required').isArray().optional({ nullable: true }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contentIds = [], dynamicContentIds = [], rule } = req.body;

    try {
      let schedule = await Schedule.findById(req.params.id);

      if (!schedule) {
        return res.status(404).json({ msg: 'Schedule not found' });
      }

      // Validate content and dynamic content IDs
      const contents = await Content.find({ _id: { $in: contentIds } });
      const dynamicContents = await DynamicContent.find({ _id: { $in: dynamicContentIds } });

      if (contents.length !== contentIds.length || dynamicContents.length !== dynamicContentIds.length) {
        return res.status(400).json({ errors: [{ msg: 'Some content IDs are invalid.' }] });
      }

      schedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        { $set: { name, contents: contentIds, dynamicContent: dynamicContentIds, rule } },
        { new: true }
      ).populate('contents dynamicContent');

      res.json(schedule);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Schedule not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// Delete Schedule
router.delete('/:id', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    await Schedule.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Schedule removed' });
  } catch (err) {
    console.error('Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Schedule not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
