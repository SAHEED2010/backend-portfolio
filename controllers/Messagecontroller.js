const Message = require("../models/Message");
const { Resend } = require('resend');

const sendMessage = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body
        if (!name || !email || !message || !subject) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const Newmessage = await Message.create({ name, email, message, subject });

        // Resend Email Integration
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact Form <onboarding@resend.dev>',
            to: [process.env.EMAIL_USER], // Try to send to the owner's email
            reply_to: email, // Set the user's email as reply-to
            subject: `Message from ${name}: ${subject}`,
            html: `
                <h3>New Message from Portfolio</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Subject:</b> ${subject}</p>
                <p><b>Message:</b></p>
                <p>${message}</p>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            // Don't fail the request if DB save was successful, but log it
            // Or return error? Better to return error if email fails so user knows
            return res.status(500).json({ message: "Error sending email", error: error });
        }

        return res.status(201).json({ message: "Message sent successfully", Newmessage: Newmessage })

    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}
module.exports = { sendMessage }