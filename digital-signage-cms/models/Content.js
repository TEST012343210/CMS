const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video', 'webpage', 'interactive', 'sssp_web_app', 'ftp', 'cifs', 'streaming', 'dynamic', 'ai'],
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
  apiUrl: {
    type: String,
  },
  updateInterval: {
    type: Number,
    required: function () {
      return this.type === 'dynamic';
    },
  },
  lastFetched: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
  aiGeneratedContent: {
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
  previewImageUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Content', ContentSchema);
