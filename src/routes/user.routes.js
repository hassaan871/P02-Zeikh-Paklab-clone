const { userSignupController } = require('../controllers/user.controller');

const express = require('express');
const router = express.Router();

router.post('/register', userSignupController);

module.exports = router;