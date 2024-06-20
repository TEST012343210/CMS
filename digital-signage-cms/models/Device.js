// models/Device.js
const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add any other necessary fields
});

module.exports = mongoose.model('Device', DeviceSchema);
