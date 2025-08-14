const express = require('express');
const router = express.Router();

const { send } = require('../controllers/emailController');

router.post('/send', send);

module.exports = router;
