const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
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
  code: {
    type: String,
    required: true,
  },
  locationId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  brand: {
    type: String,
    default: 'Unknown',
  },
  model: {
    type: String,
    default: 'Unknown',
  },
  capacity: {
    type: String,
    default: 'Unknown',
  },
  firmwareVersion: {
    type: String,
    default: 'Unknown',
  },
  macAddress: {
    type: String,
    default: 'Unknown',
  },
  ipAddress: {
    type: String,
    default: 'Unknown',
  },
  serialNumber: {
    type: String,
    default: 'Unknown',
  },
  modelName: {
    type: String,
    default: 'Unknown',
  },
});

DeviceSchema.index({ identifier: 1 }, { unique: true });

module.exports = mongoose.model('Device', DeviceSchema);
