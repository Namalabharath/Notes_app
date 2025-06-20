const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('./models/Reminder');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'namala150704@gmail.com', pass: 'onhq hryo sinb otlt' }
});

cron.schedule('* * * * *', async () => {
  const now = new Date();
console.log('Checking for due reminders at', now.toLocaleString());
  const reminders = await Reminder.find({
    reminderDateTime: { $lte: now },
    reminderSent: false,
    reminderEmail: { $exists: true, $ne: '' }
  });
  console.log('Reminders found:', reminders.length);
  for (const reminder of reminders) {
    try {
      await transporter.sendMail({
        to: reminder.reminderEmail,
        subject: 'Reminder',
        text: reminder.reminderMessage
      });
      reminder.reminderSent = true;
      await reminder.save();
     console.log(`Email sent to ${reminder.reminderEmail} for reminder "${reminder.reminderMessage}"`);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
});