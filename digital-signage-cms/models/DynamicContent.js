const mongoose = require('mongoose');

const DynamicContentSchema = new mongoose.Schema({
    contentType: String,
    apiUrl: String,
    updateInterval: Number,
    lastFetched: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed
});

const DynamicContent = mongoose.model('DynamicContent', DynamicContentSchema);
module.exports = DynamicContent;
