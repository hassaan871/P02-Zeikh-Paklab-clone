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
    userCityController,
    addToWishListController,
    removeFromWishListController
} = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/register', userSignupController);
router.post('/login', userLoginController);
router.post('/forget-password', forgetPasswordController);
router.patch('/reset-password', resetPasswordController);

// protected routes 
router.get('/account-info', [auth], userAccountInfoController);
router.patch('/phone-number', [auth], userPhoneNumberController);
router.patch('/street-address', [auth], userStreetAddressController);
router.patch('/province', [auth], userProvinceController);
router.patch('/city', [auth], userCityController);
router.patch('/postal-code', [auth], userPostalCodeController);
router.patch('/add-to-wishlist', [auth], addToWishListController);
router.delete('/remove-from-wishlist', [auth], removeFromWishListController);

module.exports = router;