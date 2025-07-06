const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        type: 'login',
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = async ({ to, subject, text }) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text
    });
};
