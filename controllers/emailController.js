const { sendAdminNotification, sendUserConfirmation } = require('../services/emailService');
const ProjectRequest = require('../models/projectRequest');

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

    const projectRequest = new ProjectRequest({
      name,
      email,
      description
    });

    const savedRequest = await projectRequest.save();

    // Admin-ə bildiriş göndər
    try {
      await sendAdminNotification({
        name,
        email,
        description,
        id: savedRequest._id
      });
    } catch (adminEmailError) {
      console.error('Admin email error:', adminEmailError.message);
    }

    // İstifadəçiyə təsdiq maili göndər
    try {
      await sendUserConfirmation({ name, email });
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