const {
    userSignupController,
    userLoginController,
    userAccountInfo,
    userPhoneNumber,
    userStreetAddress
} = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/register', userSignupController);
router.post('/login', userLoginController);

// protected routes 
router.get('/account-info', [auth], userAccountInfo);
router.post('/phone-number', [auth], userPhoneNumber);
router.post('/street-address', [auth], userStreetAddress);

module.exports = router;