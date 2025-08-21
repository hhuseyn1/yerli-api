const nodemailer = require('nodemailer');
const EmailRequest = require('../models/emailRequests'); 

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailController = {
  // Send email
  send: async (req, res) => {
    try {
      const { name, email, description } = req.body;
      
      if (!name || !email || !description) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: name, email, or description' 
        });
      }

      // Create email request record
      const emailRequest = new EmailRequest({ name, email, description });
      await emailRequest.save();

      // Send email (optional - uncomment if you want to actually send emails)
      /*
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send to admin
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${description}</p>
          `,
          replyTo: email
        });
        
        emailRequest.status = 'sent';
        await emailRequest.save();
      } catch (emailError) {
        emailRequest.status = 'failed';
        await emailRequest.save();
      }
      */

      res.json({
        success: true,
        data: {
          id: emailRequest._id,
          status: emailRequest.status,
          createdAt: emailRequest.createdAt
        }
      });
    } catch (error) {
      console.error('Email send error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

module.exports = emailController;