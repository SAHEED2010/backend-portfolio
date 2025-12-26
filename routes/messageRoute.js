const { sendMessage } = require("../controllers/Messagecontroller");
const express = require("express");
const router = express.Router();

router.post("/send-message", sendMessage);

module.exports = router;
