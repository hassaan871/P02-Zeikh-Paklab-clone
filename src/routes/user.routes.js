const {
    userSignupController,
    userLoginController,
    forgetPasswordController,
    resetPasswordController,
    userAccountInfoController,
    userPhoneNumberController,
    userStreetAddressController,
    userPostalCodeController,
    userProvinceController,
    userCityController
} = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/register', userSignupController);
router.post('/login', userLoginController);
router.post('/forget-password', forgetPasswordController);
router.post('/reset-password', resetPasswordController);

// protected routes 
router.get('/account-info', [auth], userAccountInfoController);
router.post('/phone-number', [auth], userPhoneNumberController);
router.post('/street-address', [auth], userStreetAddressController);
router.post('/province', [auth], userProvinceController);
router.post('/city', [auth], userCityController);
router.post('/postal-code', [auth], userPostalCodeController);

module.exports = router;