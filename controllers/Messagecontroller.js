const Message = require("../models/Message");
const nodemailer = require("nodemailer")

const sendMessage = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body
        if (!name || !email || !message || !subject) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const Newmessage = await Message.create({ name, email, message, subject });
        //Email Transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use SSL/TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
        });
        await transporter.sendMail({
            from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Message from ${name}`,
            html: `
        <h3>New Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
        })
        return res.status(201).json({ message: "Message sent successfully", Newmessage: Newmessage })

    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}
module.exports = { sendMessage }