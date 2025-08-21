const express = require('express');
const adminController = require('../controllers/adminController');
const { schemas, validate } = require('../middlewares/validation');

const router = express.Router();

router.post('/register', validate(schemas.adminRegister), adminController.register);
router.post('/login', validate(schemas.adminLogin), adminController.login);

module.exports = router;