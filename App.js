const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectToMongo = require("./DB")

const app = express();
const port = 5000;

connectToMongo();


// Define the Session schema
const sessionSchema = new mongoose.Schema({
  userId: Number,
  mentorId: Number,
  date: Date,
  time: String,
  bookedAt: Date
});

const Session = mongoose.model('Session', sessionSchema);

app.use(bodyParser.json());

// API to cancel a session
app.delete('/cancel_session/:session_id', async (req, res) => {
  const session = await Session.findById(req.params.session_id);

  if (session) {
    const currentTime = new Date();
    const sessionTime = new Date(session.date + ' ' + session.time);
    const timeDifference = sessionTime - currentTime;

    if (timeDifference > 12 * 3600 * 1000) {
      await Session.findByIdAndDelete(req.params.session_id);
      res.json({ message: 'Session canceled successfully' });
    } else {
      res.status(400).json({ error: 'Cannot cancel session, time difference is less than 12 hours' });
    }
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// API to reschedule a session
app.put('/reschedule_session/:session_id', async (req, res) => {
  const session = await Session.findById(req.params.session_id);

  if (session) {
    // 65ed3a13d522fb54dd9dec96
    const currentTime = new Date();
    const sessionTime = new Date(session.date + ' ' + session.time);
    const timeDifference = sessionTime - currentTime;

    if (timeDifference > 4 * 3600 * 1000) {
      const newDate = req.body.new_date;
      const newTime = req.body.new_time;

      if (newDate && newTime) {
        session.date = newDate;
        session.time = newTime;

        await session.save();
        res.json({ message: 'Session rescheduled successfully' });
      } else {
        res.status(400).json({ error: 'Invalid request. Please provide new_date and new_time' });
      }
    } else {
      res.status(400).json({ error: 'Cannot reschedule session, time difference is less than 4 hours' });
    }
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// API to book recurring sessions
app.post('/book_recurring_sessions', async (req, res) => {
  const { userId, mentorId, start_date, interval, duration } = req.body;

  if (userId && mentorId && start_date && interval && duration) {
    let currentDate = new Date(start_date);
    const endDate = new Date(currentDate.getTime() + 30 * duration * 24 * 60 * 60 * 1000);

    while (currentDate <= endDate) {
      const newSession = new Session({
        userId,
        mentorId,
        date: currentDate,
        time: new Date().toLocaleTimeString(),
        bookedAt: new Date()
      });

      await newSession.save();
      currentDate.setDate(currentDate.getDate() + 7 * interval);
    }

    res.json({ message: 'Recurring sessions booked successfully' });
  } else {
    res.status(400).json({ error: 'Invalid request. Please provide userId, mentorId, start_date, interval, and duration' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
