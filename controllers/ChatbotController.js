const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatAnalytics = require("../models/ChatAnalytics");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatbotReply = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Please ask something." });
    }

    // ✅ Log the question for analytics
    try {
      await ChatAnalytics.findOneAndUpdate(
        { question: message.toLowerCase().trim() },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Analytics Error:", err);
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const result = await model.generateContent(
      `You are an AI assistant for Yusuf Saheed's portfolio.
       Yusuf is a 15-year-old Full Stack Developer and Science Teacher.
       Answer questions about his skills (React, Node, etc.), projects (Home Science Association ERP), experience, and contact information professionally.
       
       User question: ${message}`
    );

    const reply = result.response.text();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      reply: "AI service is temporarily unavailable.",
    });
  }
};

module.exports = { chatbotReply };
