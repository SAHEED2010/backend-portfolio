const express = require("express");
const cors = require("cors");
const { sendMessage } = require("./controllers/Messagecontroller");

const messageRoute = require("./routes/messageRoute");
const chatbotRoute = require("./routes/chatbotRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Routes
app.use("/api", messageRoute);
app.use("/api" , chatbotRoute)


module.exports = app;
