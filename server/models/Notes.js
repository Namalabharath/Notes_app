const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  reminderDateTime: Date,
  reminderEmail: String,
  reminderMessage: String,
  reminderSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Note', NoteSchema);