const mongoose = require("mongoose");

const failedRequestSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String, required: true },
});

module.exports = mongoose.model("FailedRequest", failedRequestSchema);
