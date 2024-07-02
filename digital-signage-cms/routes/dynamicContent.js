const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const DynamicContent = require('../models/DynamicContent');

// Create Dynamic Content
router.post(
  '/',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('apiUrl', 'API URL is required').isURL(),
      check('updateInterval', 'Update Interval is required').isInt({ min: 1 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, apiUrl, updateInterval } = req.body;

    try {
      const newDynamicContent = new DynamicContent({
        title,
        apiUrl,
        updateInterval,
        user: req.user.id,
      });

      const dynamicContent = await newDynamicContent.save();
      res.json(dynamicContent);
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get All Dynamic Content
router.get('/', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const dynamicContent = await DynamicContent.find().sort({ createdAt: -1 });
    res.json(dynamicContent);
  } catch (err) {
    console.error('Error fetching dynamic content:', err);
    res.status(500).send('Server error');
  }
});

// Get Dynamic Content by ID
router.get('/:id', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const dynamicContent = await DynamicContent.findById(req.params.id);

    if (!dynamicContent) {
      return res.status(404).json({ msg: 'Dynamic content not found' });
    }

    res.json(dynamicContent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Dynamic content not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update Dynamic Content
router.put(
  '/:id',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('apiUrl', 'API URL is required').isURL(),
      check('updateInterval', 'Update Interval is required').isInt({ min: 1 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, apiUrl, updateInterval } = req.body;

    try {
      let dynamicContent = await DynamicContent.findById(req.params.id);

      if (!dynamicContent) {
        return res.status(404).json({ msg: 'Dynamic content not found' });
      }

      dynamicContent = await DynamicContent.findByIdAndUpdate(
        req.params.id,
        { $set: { title, apiUrl, updateInterval } },
        { new: true }
      );

      res.json(dynamicContent);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Dynamic content not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// Delete Dynamic Content
router.delete('/:id', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  try {
    const dynamicContent = await DynamicContent.findById(req.params.id);

    if (!dynamicContent) {
      return res.status(404).json({ msg: 'Dynamic content not found' });
    }

    await DynamicContent.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Dynamic content removed' });
  } catch (err) {
    console.error('Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Dynamic content not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
