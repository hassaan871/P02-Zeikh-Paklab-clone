const User = require('../models/user.model');
const Laptop = require('../models/laptop.model');
const Smartwatch = require('../models/smartwatch.model');

const asyncHandler = require('../utils/asyncHandler');
const { validateUser, validateLoginUser } = require('../validations/user.validations');
const { createCart } = require('../utils/createCart.util');
const sendEmail = require('../utils/emailService');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSignupController = async (req, res) => {

    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ "error-message": error.details[0].message });

    const { firstname, lastname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ "error-message": "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    const data = user.toObject();
    delete data.password;

    const cart = await createCart(user._id);
    if (!cart) console.error("Cart not created", cart);

    return res.status(201).header("x-auth-token", token).json(data);
}

const userLoginController = async (req, res) => {

        const { email, password } = req.body;

        const { error } = validateLoginUser({ email, password });
        if (error) return res.status(401).json({ "error-message": error.details[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ "error-message": "Invalid email" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ "error-message": "Invalid password" });

        const token = user.generateAuthToken();
        return res.status(200).json({ token });
}

const forgetPasswordController = async (req, res) => {

        const { email } = req.body;
        if (!email) return res.status(400).json({ "error-message": "email is required" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ "error-message": "invalid email" });

        // Generates a reset token and set its expiration to 1hr
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = resetToken;
        const resetPasswordExpires = Date.now() + 3600000;

        const user = await User.findOneAndUpdate({ email: email }, {
            $set: {
                resetPasswordToken,
                resetPasswordExpires
            }
        }, { new: true });

        if (!user) return res.status(404).json({ "error-message": "user not found" });

        const mail = {
            to: user.email,
            subject: "Password reset request",
            text: `Please click the following link, here is the reset password token which is going to expires in 1hr. \n Reset Password Token: ${resetPasswordToken} `
        };

        await sendEmail(mail);
        return res.status(200).json({ "success-message": "Password reset email sent" });
}

const resetPasswordController = async (req, res) => {

        const { resetPasswordToken, newPassword } = req.body;
        if (!resetPasswordToken || !newPassword) return res.status(400).json({ "error-message": "resetPasswordToken and newPassword both are required" });

        if ( newPassword.length === 5 ) return res.status(400).json({"error-message": "password length must be greater thar or equal to 5."});

        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ "error-message": "Invalide token or token expired" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ "success-message": "password updated successfully" });
}

const userAccountInfoController = async (req, res) => {

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        const { password, ...withoutPassword } = user._doc;
        return res.status(200).json(withoutPassword);
}

const userPhoneNumberController = async (req, res) => {

        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ "error-message": "Phone number is required" });

        const phoneNumberRegex = /^\d{11}$/;
        if (!phoneNumberRegex.test(phoneNumber)) return res.status(400).json({ "error-message": "phone number must be of 11 digit" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { phoneNumber } }, { new: true });
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Phone number updated", user });
}

const userStreetAddressController = async (req, res) => {

        const { streetAddress } = req.body;
        if (!streetAddress) return res.status(400).json({ "error-message": "Street address is required" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { "address.streetAddress": streetAddress } }, { new: true });
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Street Address updated", user });
}

const userPostalCodeController = async (req, res) => {

        const { postalCode } = req.body;
        if (!postalCode) return res.status(400).json({ "error-message": "Postal code is required" });

        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(postalCode)) return res.status(400).json({ "error-message": "postal code must be a 5 digit number" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { "address.postalCode": postalCode } }, { new: true });
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Postal Code updated", user });
}

const userProvinceController = async (req, res) => {
    try {
        const { province } = req.body;
        if (!province) return res.status(400).json({ "error": "Province is required" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { "address.province": province } }, { new: true });
        if (!user) return res.status(404).json({ "error": "User not found" });

        return res.status(200).json({ "message": "Province updated", user });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const userCityController = async (req, res) => {
    try {
        const { city } = req.body;
        if (!city) return res.status(400).json({ "error": "City is required" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { "address.city": city } }, { new: true });
        if (!user) return res.status(404).json({ "error": "User not found" });

        return res.status(200).json({ "message": "City updated", user });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const addToWishListController = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error": "productId to be added in wishlist is required." });

        const user = await User.findById(req.user.userId);

        const laptop = await Laptop.findById(productId);

        if (!laptop) {
            const smartwatch = await Smartwatch.findById(productId);
            if (!smartwatch) return res.status(404).json({ "error": "invalid productId. laptop/smartwatch not found" });
            user.wishList.push(smartwatch._id);
            await user.save();
            return res.status(200).json({ "success": "smartWatch added to wishlist", user });
        }

        user.wishList.push(laptop._id);
        await user.save();
        return res.status(200).json({ "success": "laptop added to wishlist", user });

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const removeFromWishListController = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error": "productId to be removed form the wishlist is required" });

        const user = await User.findById(req.user.userId);
        for (let i = 0; i < user.wishList.length; i++) {
            if (productId === user.wishList[i].toString()) {
                user.wishList.splice(i, 1);
                await user.save();
                return res.status(200).json({ "success": "product removed from the wishlist", user });
            }
        }

        return res.status(404).json({ "error": "product not found in wishlist" });
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

module.exports = {
    userSignupController: asyncHandler(userSignupController),
    userLoginController: asyncHandler(userLoginController),
    forgetPasswordController: asyncHandler(forgetPasswordController),
    resetPasswordController: asyncHandler(resetPasswordController),
    userAccountInfoController: asyncHandler(userAccountInfoController),
    userPhoneNumberController: asyncHandler(userPhoneNumberController),
    userStreetAddressController: asyncHandler(userStreetAddressController),
    userPostalCodeController: asyncHandler(userPostalCodeController),
    userProvinceController,
    userCityController,
    addToWishListController,
    removeFromWishListController
}