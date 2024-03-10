# MERN Session Management Web App

This is a simple web application that allows users to manage sessions with mentors. Users can book, cancel, and reschedule sessions with mentors. The application is built using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm (Node Package Manager)
- MongoDB (Make sure MongoDB is running locally or provide a connection URI)
- Git (optional)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/garvit-001/LP-Tech.git
   cd LP-Tech

2. install backend dependencies
cd backend
npm install

3. Configure the MongoDB connection:
Open DB.js and update the MongoDB connection URI as needed.

4. Run the application:
nodemon App.js

## Usage
API Endpoints

Cancel Session:
Endpoint: DELETE /cancel_session/:session_id
Request Body: { "session_id": "your_session_id" }

Reschedule Session:
Endpoint: PUT /reschedule_session/:session_id
Request Body: { "new_date": "2024-03-17", "new_time": "15:00:00" }

Book Recurring Sessions:
Endpoint: POST /book_recurring_sessions
Request Body:
{
  "userId": 1,
  "mentorId": 2,
  "start_date": "2024-03-10",
  "interval": 1,
  "duration": 3
}