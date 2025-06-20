import React, { useState, useEffect } from 'react';
import './Reminders.css'; // Import the CSS file

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [reminderEmail, setReminderEmail] = useState('');
  const baseUrl = `${import.meta.env.VITE_SERVER_URL}/reminders`;
  useEffect(() => {
    fetch(baseUrl)
      .then(res => res.json())
      .then(data => setReminders(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminderMessage, reminderDateTime, reminderEmail }),
    });
    const newReminder = await res.json();
    setReminders([...reminders, newReminder]);
    setReminderMessage('');
    setReminderDateTime('');
    setReminderEmail('');
  };

  return (
    <div className="reminders-container">
      <h1>Reminders</h1>
      <form className="reminder-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Message:</label>
          <input
            type="text"
            value={reminderMessage}
            onChange={e => setReminderMessage(e.target.value)}
            required
            placeholder="Enter your reminder message"
          />
        </div>
        <div className="form-group">
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            value={reminderDateTime}
            onChange={e => setReminderDateTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={reminderEmail}
            onChange={e => setReminderEmail(e.target.value)}
            required
            placeholder="example@email.com"
          />
        </div>
        <button type="submit" className="submit-btn">Create Reminder</button>
      </form>
      <h2>All Reminders</h2>
      <div className="table-container">
        <table className="reminders-table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Date & Time</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(reminder => (
              <tr key={reminder._id}>
                <td>{reminder.reminderMessage}</td>
                <td>{new Date(reminder.reminderDateTime).toLocaleString()}</td>
                <td>{reminder.reminderEmail}</td>
                <td>
                  <span className={reminder.reminderSent ? "status sent" : "status scheduled"}>
                    {reminder.reminderSent ? 'Sent' : 'Scheduled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reminders;