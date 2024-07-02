const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Content',
            required: true,
        }
    ],
    dynamicContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DynamicContent'
        }
    ],
    rule: {
        type: String, // Example: 'weather == sunny'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);