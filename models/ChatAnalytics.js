const mongoose = require("mongoose");

const chatAnalyticsSchema = new mongoose.Schema({
  question: String,
  count: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("ChatAnalytics", chatAnalyticsSchema);
