const mongoose = require('mongoose');

const DynamicContentSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  apiUrl: {
    type: String,
    required: true,
  },
  updateInterval: {
    type: Number,
    required: true,
  },
  lastFetched: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DynamicContent = mongoose.model('DynamicContent', DynamicContentSchema);
module.exports = DynamicContent;
