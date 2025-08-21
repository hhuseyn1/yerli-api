const express = require('express');
const emailController = require('../controllers/emailController');
const { schemas, validate } = require('../middlewares/validation');

const router = express.Router();

router.post('/send', validate(schemas.emailRequest), emailController.send);

module.exports = router;