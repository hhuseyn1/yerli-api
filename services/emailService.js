const { sendEmail } = require('../services/emailService');
const Project = require('../models/projects');

const send = async (req, res) => {
  try {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, or description'
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const project = new Project({
      name,
      email,
      description
    });

    const savedRequest = await project.save();

    try {
      await sendEmail({
        to: email,
        subject: 'Thank you for your request',
        text: `Dear ${name}, thank you for your request! We will contact you soon.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Thank you for your request!</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <p>Your request has been successfully received and will be reviewed shortly.</p>
              <p>We will contact you soon.</p>
            </div>
            <p style="margin-top: 20px; color: #666;">
              Best regards,<br>
              <strong>Our Team</strong>
            </p>
          </div>
        `
      });
    } catch (userEmailError) {
      console.error('User email error:', userEmailError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Request sent successfully',
      data: {
        id: savedRequest._id,
        status: savedRequest.status,
        createdAt: savedRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { 
  send
};