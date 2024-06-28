const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const Schedule = require('../models/Schedule');
const Content = require('../models/Content');

// Create Schedule
router.post(
  '/',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('contentIds', 'Content IDs are required').isArray().notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contentIds } = req.body;

    try {
      const newSchedule = new Schedule({
        name,
        contents: contentIds,
        user: req.user.id,
      });

      const schedule = await newSchedule.save();
      res.json(schedule);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get All Schedules
router.get('/', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('contents').sort({ createdAt: -1 });
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Schedule by ID
router.get('/:id', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('contents');

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
      check('contentIds', 'Content IDs are required').isArray().notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contentIds } = req.body;

    try {
      let schedule = await Schedule.findById(req.params.id);

      if (!schedule) {
        return res.status(404).json({ msg: 'Schedule not found' });
      }

      schedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        { $set: { name, contents: contentIds } },
        { new: true }
      ).populate('contents');

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
    console.log(`Attempting to delete schedule with ID: ${req.params.id}`);
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      console.log('Schedule not found');
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    await Schedule.deleteOne({ _id: req.params.id });
    console.log('Schedule removed');
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
