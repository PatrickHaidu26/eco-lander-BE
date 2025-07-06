const sendEmail = require('../utils/mailer');

exports.submitQuestionnaire = async (req, res) => {
    const { answers } = req.body;
    console.log("Questionnaire Answers:", answers);
    res.status(200).json({ message: 'Questionnaire submitted successfully' });
};

exports.reportIncident = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await sendEmail({
            to: process.env.RECEIVER_EMAIL,
            subject: "EcoSmart Incident Report",
            text: `From: ${name} (${email})\n\n${message}`
        });
        res.status(200).json({ message: 'Incident reported successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Email failed to send' });
    }
};
