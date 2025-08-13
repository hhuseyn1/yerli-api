const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'info@yerli.art',
        pass: ''
    }
});

module.exports = transporter;