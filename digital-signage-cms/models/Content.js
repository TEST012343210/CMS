// models/Content.js
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video', 'webpage', 'interactive', 'sssp_web_app', 'ftp', 'cifs', 'streaming'],
    required: true,
  },
  url: {
    type: String,
  },
  file: {
    type: String,
  },
  ssspUrl: {
    type: String,
  },
  ftpDetails: {
    host: String,
    path: String,
    username: String,
    password: String,
  },
  cifsDetails: {
    host: String,
    path: String,
    username: String,
    password: String,
  },
  streamingUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Content', ContentSchema);
