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
        if (!user) return res.status(400).json({ "error-message": "Invalid email or password" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ "error-message": "Invalid password or password" });

        const token = user.generateAuthToken();
        return res.status(200).json({
                success: true,
                message: "Login Successfull",
                token
        });
}

const forgetPasswordController = async (req, res) => {

        const { email } = req.body;
        if (!email) return res.status(400).json({ "error-message": "email is required" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ "error-message": "Invalid Email" });

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

        if (!user) return res.status(400).json({ "error-message": "Invalid Email" });

        const mail = {
                to: user.email,
                subject: "Password reset request",
                text: `Please click the following link, here is the reset password token which is going to expires in 1hr. \n Reset Password Token: ${resetPasswordToken} `
        };

        await sendEmail(mail);
        return res.status(200).json({ "success-message": "If this email is registered, a Password reset link has been sent" });
}

const resetPasswordController = async (req, res) => {

        const { resetPasswordToken, newPassword } = req.body;
        if (!resetPasswordToken || !newPassword) return res.status(400).json({ "error-message": "resetPasswordToken and newPassword both are required" });

        if (newPassword.length < 5) return res.status(400).json({ "error-message": "password length must be greater thar or equal to 5." });

        const user = await User.findOne({
                resetPasswordToken: resetPasswordToken,
                resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(401).json({ "error-message": "Invalide token or token expired" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ "success-message": "password updated successfully" });
}

const userAccountInfoController = async (req, res) => {

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json(user);
}

const userPhoneNumberController = async (req, res) => {

        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ "error-message": "Phone number is required" });

        const phoneNumberRegex = /^\d{11}$/;
        if (!phoneNumberRegex.test(phoneNumber)) return res.status(400).json({ "error-message": "phone number must be of 11 digit" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { phoneNumber } }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Phone number updated", user });
}

const userStreetAddressController = async (req, res) => {

        const { streetAddress } = req.body;
        if (!streetAddress) return res.status(400).json({ "error-message": "Street address is required" });

        if (streetAddress.length < 5) return res.status(400).json({ "error-message": "street address must be greater than equal to 5 characters long" });

        const user = await User.findByIdAndUpdate(
                req.user.userId,
                { $set: { "address.streetAddress": streetAddress } },
                { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Street Address updated", user });
}

const userPostalCodeController = async (req, res) => {

        const { postalCode } = req.body;
        if (!postalCode) return res.status(400).json({ "error-message": "Postal code is required" });

        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(postalCode)) return res.status(400).json({ "error-message": "postal code must be a 5 digit number" });

        const user = await User.findByIdAndUpdate(
                req.user.userId,
                { $set: { "address.postalCode": postalCode } },
                { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Postal Code updated", user });
}

const userProvinceController = async (req, res) => {

        const { province } = req.body;
        if (!province) return res.status(400).json({ "error-message": "Province is required" });

        const user = await User.findByIdAndUpdate(
                req.user.userId,
                { $set: { "address.province": province } },
                { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "Province updated", user });
}

const userCityController = async (req, res) => {

        const { city } = req.body;
        if (!city) return res.status(400).json({ "error-message": "City is required" });

        const user = await User.findByIdAndUpdate(
                req.user.userId,
                { $set: { "address.city": city } },
                { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ "error-message": "User not found" });

        return res.status(200).json({ "success-message": "City updated", user });
}

const addToWishListController = async (req, res) => {

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error-message": "productId to be added in wishlist is required." });

        const user = await User.findById(req.user.userId).select("-password");

        if(user.wishList.includes(productId)) return res.status(400).json({"error-message":"Product already in wishlist"});

        const laptop = await Laptop.findById(productId);

        if (!laptop) {
                const smartwatch = await Smartwatch.findById(productId);
                if (!smartwatch) return res.status(404).json({ "error-message": "invalid productId. laptop/smartwatch not found" });
                user.wishList.push(smartwatch._id);
                await user.save();
                return res.status(200).json({ "success-message": "smartWatch added to wishlist", user });
        }

        user.wishList.push(laptop._id);
        await user.save();
        return res.status(200).json({ "success-message": "laptop added to wishlist", user });
}

const removeFromWishListController = async (req, res) => {

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error-message": "productId to be removed form the wishlist is required" });

        const user = await User.findById(req.user.userId).select("-password");
        for (let i = 0; i < user.wishList.length; i++) {
                if (productId === user.wishList[i].toString()) {
                        user.wishList.splice(i, 1);
                        await user.save();
                        return res.status(200).json({ "success-message": "product removed from the wishlist", user });
                }
        }

        return res.status(404).json({ "error-message": "product not found in wishlist" });
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
        userProvinceController: asyncHandler(userProvinceController),
        userCityController: asyncHandler(userCityController),
        addToWishListController: asyncHandler(addToWishListController),
        removeFromWishListController: asyncHandler(removeFromWishListController)
}