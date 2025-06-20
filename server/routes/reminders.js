const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Get all reminders
router.get('/', async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
});

// Create a new reminder
router.post('/', async (req, res) => {
  const { reminderMessage, reminderDateTime, reminderEmail } = req.body;
  const reminder = new Reminder({ reminderMessage, reminderDateTime, reminderEmail });
  await reminder.save();
  res.json(reminder);
});

module.exports = router;