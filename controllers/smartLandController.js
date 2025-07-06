const sendEmail = require('../utils/mailer');

exports.contact = async (req, res) => {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
        return res.status(400).json({ message: ' subject, and message are required' });
    }
    
    try {
        await sendEmail({
            to: process.env.RECEIVER_EMAIL,
            subject: `Contact Form: ${subject}`,
            text: `${message}`
        });
        res.status(200).json({ message: 'Contact message sent successfully' });
    } catch (err) {
        console.error('Contact email error:', err);
        res.status(500).json({ error: 'Failed to send contact message' });
    }
};
