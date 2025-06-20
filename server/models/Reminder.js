const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  reminderMessage: String,
  reminderDateTime: Date,
  reminderEmail: String,
  reminderSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);