# Alerting System for Monitoring Failed POST Requests

## Overview

This project implements a backend alerting system that monitors a specific POST endpoint (`/api/submit`) for failed requests. It tracks invalid requests based on headers or access tokens, logs metrics, and sends email alerts when the failure threshold from a single IP address is exceeded. Metrics are stored in a MongoDB database for further analysis.

## Features

- Validates requests based on headers (e.g., `Authorization`).
- Logs failed requests with details (IP address, timestamp, and reason).
- Tracks the number of failed requests from each IP within a configurable time window.
- Sends email alerts via Google SMTP when a failure threshold is breached.
- Exposes an endpoint to fetch stored metrics.

## Tech Stack

- **Backend Language:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Email Service:** Google SMTP (Gmail)

## Prerequisites

1. Node.js and npm installed on your system.
2. MongoDB instance running locally or remotely.
3. Postman (or any API testing tool) to test the endpoints.
4. Google SMTP credentials for email notifications.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <https://github.com/NirbhaySingh74/alerting-system.git>
cd <alerting-system>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5000
DB_URI=your-mongodb-connection-uri
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
FAILURE_THRESHOLD=5  # Default threshold for failed requests
TIME_WINDOW=10       # Time window in minutes
```

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### 1. POST `/api/submit`

**Description:** Validates requests, logs failures, and triggers email alerts if the threshold is breached.

#### Request

- **Headers:**
  - `Authorization: Bearer valid-token`
- **Body (Optional):** Any JSON payload.

#### Response

- **200 OK:**
  ```json
  {
    "message": "Request successful"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Invalid Authorization Header"
  }
  ```

### 2. GET `/api/metrics`

**Description:** Fetches stored metrics of failed requests.

#### Response

- **200 OK:**
  ```json
  [
    {
      "_id": "unique-id",
      "ip": "127.0.0.1",
      "timestamp": "2025-01-10T00:00:00.000Z",
      "reason": "Invalid Authorization Header"
    }
  ]
  ```

## Testing the Application

1. Use Postman to send requests to `/api/submit`:
   - Send valid requests with correct headers to test successful handling.
   - Send invalid requests to trigger logging and alerts.
2. Check your email inbox for alert notifications when the failure threshold is exceeded.
3. Use `/api/metrics` to verify logged data.

## Project Structure

```
.
├── controllers
│   └── submitController.js  # Handles request validation and alerts
├── models
│   └── failedRequest.js     # MongoDB schema for failed requests
├── routes
│   └── submit.js            # API routes
├── .env                     # Environment variables
├── index.js                 # Main application entry point
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```
