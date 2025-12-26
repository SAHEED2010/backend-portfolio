
const express = require("express");
const router = express.Router();
const { chatbotReply } = require("../controllers/ChatbotController");

router.post("/chat", chatbotReply);

module.exports = router;
