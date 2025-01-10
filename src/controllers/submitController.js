const FailedRequest = require("../models/failedRequest");
const nodemailer = require("nodemailer");

// Utility to get IP address
const getIpAddress = (req) => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

// Configuration values
const FAILURE_THRESHOLD = parseInt(process.env.FAILURE_THRESHOLD) || 5;
const TIME_WINDOW = parseInt(process.env.TIME_WINDOW) || 10;

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Handle POST requests to /api/submit
exports.handleSubmit = async (req, res) => {
  const ip = getIpAddress(req);
  const { headers } = req;

  // Validate headers (Example: Check for Authorization)
  if (
    !headers.authorization ||
    headers.authorization !== "Bearer valid-token"
  ) {
    const reason = "Invalid Authorization Header";

    // Log the failed request and track failures
    await logAndTrackFailedRequest(ip, reason);

    return res.status(401).json({ error: reason });
  }

  // Request handling logic for valid requests
  res.status(200).json({ message: "Request successful" });
};

// Log a failed request and track the failure count
const logAndTrackFailedRequest = async (ip, reason) => {
  try {
    // Log the failed request in the database
    const failedRequest = new FailedRequest({ ip, reason });
    await failedRequest.save();

    console.log(`Logged failed request from ${ip}: ${reason}`);

    // Count failures from the same IP within the configured time window
    const timeLimit = new Date(Date.now() - TIME_WINDOW * 60 * 1000);
    const failureCount = await FailedRequest.countDocuments({
      ip,
      timestamp: { $gte: timeLimit },
    });

    console.log(`Failure count for IP ${ip}: ${failureCount}`);

    // Send an alert email if the failure threshold is exceeded
    if (failureCount >= FAILURE_THRESHOLD) {
      await sendAlertEmail(ip, failureCount);
    }
  } catch (err) {
    console.error("Error tracking failed request:", err);
  }
};

// Send an alert email when the failure threshold is exceeded
const sendAlertEmail = async (ip, failureCount) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER, // Send email to the configured SMTP user
    subject: "Alert: Failed Request Threshold Exceeded",
    text: `IP Address ${ip} has exceeded the failure threshold with ${failureCount} failed requests in the last ${TIME_WINDOW} minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent for IP ${ip}`);
  } catch (err) {
    console.error("Error sending alert email:", err);
  }
};

// GET /api/metrics
exports.getMetrics = async (req, res) => {
  try {
    const metrics = await FailedRequest.find();
    res.status(200).json(metrics);
  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
