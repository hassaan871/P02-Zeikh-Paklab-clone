const {
    userSignupController,
    userLoginController,
    userAccountInfoController,
    userPhoneNumberController,
    userStreetAddressController,
    userPostalCodeController
} = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/register', userSignupController);
router.post('/login', userLoginController);

// protected routes 
router.get('/account-info', [auth], userAccountInfoController);
router.post('/phone-number', [auth], userPhoneNumberController);
router.post('/street-address', [auth], userStreetAddressController);
router.post('/postal-code', [auth], userPostalCodeController);

module.exports = router;