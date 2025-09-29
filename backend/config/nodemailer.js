const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const sendMail = (toEmail, content) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        port: 587,
        secure: false,
        auth: {
            user:process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from:process.env.EMAIL,
        to: toEmail,
        subject: 'Verification',
        text: content
    }
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        })
    })
}

module.exports = sendMail;