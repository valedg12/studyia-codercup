
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    completed: { type: Boolean, default: false } // <-- Nuevo campo
});

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    examDate: { type: Date, required: true },
    hoursPerDay: { type: Number, required: true },
    topics: [topicSchema],
    studyPlan: { type: String }
});

module.exports = mongoose.model('Subject', subjectSchema);