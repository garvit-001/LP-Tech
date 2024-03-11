const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const connectToMongo = require("./DB");

const app = express();
const port = 5000;

connectToMongo();

// Define the Session schema
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    mentorId: {
      type: Number,
      required: true,
      unique: true,
    },
    date: Date,
    time: String,
    bookedAt: Date,
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

app.use(bodyParser.json());

// API to cancel a session
app.delete("/cancel_session/:session_id", async (req, res) => {
  const session = await Session.findById(req.params.session_id);

  if (session) {
    const currentTime = new Date();
    const timeDifference = currentTime - session.updatedAt;
    console.log(
      timeDifference,
      " ",
      currentTime,
      " ",
      session.updatedAt,
      " "
      // sessionTime.getTime()
    );

    if (timeDifference > 12 * 3600 * 1000) {
      await Session.findByIdAndDelete(req.params.session_id);
      res.json({ message: "Session canceled successfully" });
    } else {
      res.status(400).json({
        error: "Cannot cancel session, time difference is less than 12 hours",
      });
    }
  } else {
    res.status(404).json({ error: "Session not found" });
  }
});

// API to reschedule a session
app.put("/reschedule_session/:session_id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.session_id);

    if (session) {
      const currentTime = new Date();
      const timeDifference = currentTime - session.updatedAt;
      console.log(
        timeDifference,
        " ",
        currentTime,
        " ",
        session.updatedAt,
        " "
        // sessionTime.getTime()
      );

      // Check if the session was updated within the last 4 hours
      if (timeDifference > 4 * 3600 * 1000) {
        const newDate = req.body.new_date;
        const newTime = req.body.new_time;

        if (newDate && newTime) {
          session.date = new Date(newDate);
          session.time = newTime;
          session.updatedAt = new Date(); // Update the updatedAt field

          await session.save();
          res.json({ message: "Session rescheduled successfully" });
        } else {
          res.status(400).json({
            error: "Invalid request. Please provide new_date and new_time",
          });
        }
      } else {
        res.status(400).json({
          error:
            "Cannot reschedule session, time difference is less than 4 hours",
        });
      }
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to book a session
app.post("/book_recurring_sessions", async (req, res) => {
  try {
    const { userId, mentorId, date, time } = req.body;

    // Check for existing session with the same mentor, user, date, and time
    const existingSession = await Session.findOne({
      userId,
      mentorId,
      date,
      time,
    });

    if (existingSession) {
      res
        .status(400)
        .json({
          error:
            "Session already booked for the same mentor and user at the specified date and time",
        });
    } else {
      const newSession = new Session({
        userId,
        mentorId,
        date: new Date(date),
        time,
        bookedAt: new Date(),
      });

      await newSession.save();
      res.json({ message: "Session booked successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
