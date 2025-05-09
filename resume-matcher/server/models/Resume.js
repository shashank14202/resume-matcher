const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    extractedText: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Resume', ResumeSchema);
