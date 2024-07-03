const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const Content = require('../models/Content');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post(
  '/',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    upload.single('file'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('contentType', 'Content Type is required').isIn([
        'image', 'video', 'webpage', 'interactive', 'sssp-web-app', 'ftp', 'cifs', 'streaming', 'dynamic'
      ]),
      check('updateInterval', 'Update Interval is required for dynamic content').if(check('contentType').equals('dynamic')).not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, contentType, url, ssspUrl, ftpDetails, cifsDetails, streamingUrl, apiUrl, updateInterval } = req.body;
    let fileUrl = url;

    if (req.file) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    try {
      let data = null;
      if (contentType === 'dynamic' && apiUrl) {
        const response = await axios.get(apiUrl);
        data = response.data;
      }

      const newContent = new Content({
        title,
        type: contentType,
        url: contentType === 'webpage' ? url : undefined,
        file: req.file ? fileUrl : undefined,
        ssspUrl: contentType === 'sssp-web-app' ? ssspUrl : undefined,
        ftpDetails: contentType === 'ftp' ? JSON.parse(ftpDetails) : undefined,
        cifsDetails: contentType === 'cifs' ? JSON.parse(cifsDetails) : undefined,
        streamingUrl: contentType === 'streaming' ? streamingUrl : undefined,
        apiUrl: contentType === 'dynamic' ? apiUrl : undefined,
        updateInterval: contentType === 'dynamic' ? updateInterval : undefined,
        lastFetched: contentType === 'dynamic' ? new Date() : undefined,
        data: contentType === 'dynamic' ? data : undefined,
        user: req.user.id,
        previewImageUrl: req.file ? fileUrl : undefined,
      });

      const content = await newContent.save();
      console.log('Content saved:', content);

      res.json(content);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.put(
  '/delete',
  [auth, checkRole(['Admin', 'Content Manager'])],
  async (req, res) => {
    const { ids } = req.body;
    try {
      await Content.deleteMany({ _id: { $in: ids } });
      res.json({ msg: 'Contents deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
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

router.get('/dynamic/:id', [auth, checkRole(['Admin', 'Content Manager', 'User'])], async (req, res) => {
  try {
    const dynamicContent = await Content.findById(req.params.id);

    if (!dynamicContent || dynamicContent.type !== 'dynamic') {
      return res.status(404).json({ msg: 'Dynamic content not found' });
    }

    res.json(dynamicContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put(
  '/:id',
  [
    auth,
    checkRole(['Admin', 'Content Manager']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('contentType', 'Content Type is required').isIn([
        'image', 'video', 'webpage', 'interactive', 'sssp-web-app', 'ftp', 'cifs', 'streaming', 'dynamic'
      ]),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, contentType, url, ssspUrl, ftpDetails, cifsDetails, streamingUrl, apiUrl, updateInterval } = req.body;

    try {
      let content = await Content.findById(req.params.id);

      if (!content) {
        return res.status(404).json({ msg: 'Content not found' });
      }

      if (content.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      let data = content.data;
      if (contentType === 'dynamic' && apiUrl && apiUrl !== content.apiUrl) {
        const response = await axios.get(apiUrl);
        data = response.data;
      }

      content = await Content.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title,
            type: contentType,
            url: contentType === 'webpage' ? url : undefined,
            ssspUrl: contentType === 'sssp-web-app' ? ssspUrl : undefined,
            ftpDetails: contentType === 'ftp' ? JSON.parse(ftpDetails) : undefined,
            cifsDetails: contentType === 'cifs' ? JSON.parse(cifsDetails) : undefined,
            streamingUrl: contentType === 'streaming' ? streamingUrl : undefined,
            apiUrl: contentType === 'dynamic' ? apiUrl : undefined,
            updateInterval: contentType === 'dynamic' ? updateInterval : undefined,
            lastFetched: contentType === 'dynamic' ? new Date() : undefined,
            data: contentType === 'dynamic' ? data : undefined,
            previewImageUrl: content.previewImageUrl,
          },
        },
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

router.delete('/:id', [auth, checkRole(['Admin', 'Content Manager'])], async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }

    if (content.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Content.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Content removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
