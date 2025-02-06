const { userSignupController, userLoginController } = require('../controllers/user.controller');

const express = require('express');
const router = express.Router();

router.post('/register', userSignupController);
router.post('/login', userLoginController);

module.exports = router;