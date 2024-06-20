// routes/content.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const Content = require('../models/Content');

// Create Content
router.post(
  '/',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['image', 'video', 'webpage', 'interactive']),
      check('url', 'URL is required').isURL(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, type, url } = req.body;

    try {
      const newContent = new Content({
        title,
        type,
        url,
        user: req.user.id,
      });

      const content = await newContent.save();
      res.json(content);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get All Content
router.get('/', auth, async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Content by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }

    res.json(content);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update Content
router.put(
  '/:id',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['image', 'video', 'webpage', 'interactive']),
      check('url', 'URL is required').isURL(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, type, url } = req.body;

    try {
      let content = await Content.findById(req.params.id);

      if (!content) {
        return res.status(404).json({ msg: 'Content not found' });
      }

      // Check user
      if (content.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      content = await Content.findByIdAndUpdate(
        req.params.id,
        { $set: { title, type, url } },
        { new: true }
      );

      res.json(content);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Content not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// Delete Content
router.delete('/:id', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  try {
    console.log(`Attempting to delete content with ID: ${req.params.id}`);
    const content = await Content.findById(req.params.id);

    if (!content) {
      console.log('Content not found');
      return res.status(404).json({ msg: 'Content not found' });
    }

    // Check user
    if (content.user.toString() !== req.user.id) {
      console.log(`User not authorized. Content belongs to user: ${content.user}, but request made by user: ${req.user.id}`);
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Content.deleteOne({ _id: req.params.id });
    console.log('Content removed');
    res.json({ msg: 'Content removed' });
  } catch (err) {
    console.error('Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
