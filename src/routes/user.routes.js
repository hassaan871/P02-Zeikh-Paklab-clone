const { userSignupController } = require('../controllers/user.controller');

const express = require('express');
const router = express.Router();

router.post('/register-user', userSignupController);

module.exports = router;