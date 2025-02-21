const User = require('../models/user.model');
const { validateUser, validateLoginUser } = require('../validations/user.validations');
const { createCart } = require('../utils/createCart.util');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const userSignupController = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) res.status(400).json({ "error-message": error.details[0].message });

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
        if(!cart) console.error("Cart not created", cart);

        return res.status(201).header("x-auth-token", token).json(data);

    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ "error-message": "Duplicate entry " + error.message });

        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message
        };

        return res.status(500).json(result);
    }
}

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = validateLoginUser({ email, password });
        if (error) return res.status(401).json({ "error": error.details[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ "error": "Invalid email" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ "error": "Invalid password" });

        const token = user.generateAuthToken();
        return res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const forgetPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ "error": "email is required" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ "error": "invalid email" });

        // Generates a reset token and set its expiration to 1hr
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = resetToken;
        const resetPasswordExpires = Date.now() + 3600000;

        const user = await User.findOneAndUpdate({ email: email }, {
            $set: {
                resetPasswordToken: resetPasswordToken,
                resetPasswordExpires: resetPasswordExpires
            }
        }, { new: true });

        if (!user) return res.status(404).json({ "error": "user not found" });

        const mail = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password reset request",
            text: `Please click the following link, here is the reset password token which is going to expires in 1hr. \n Reset Password Token: ${resetPasswordToken} `
        };

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail(mail);
        res.status(200).json({ "message": "Password reset email sent" });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error", error });
    }
}

const resetPasswordController = async (req, res) => {
    try {
        const { resetPasswordToken, newPassword } = req.body;
        if( !resetPasswordToken || !newPassword ) return res.status(400).json({"error": "resetPasswordToken and newPassword both are required"});
        
        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if( !user ) return res.status(400).json({"error":"Invalide token or token expired"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({"success": "password updated successfully"});
        
    } catch (error) {
        return res.status(500).json({"error": "Internal server error"});
    }
}

const userAccountInfoController = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ "error": "User not found" });

        const { password, ...withoutPassword } = user._doc;
        return res.status(200).json(withoutPassword);

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const userPhoneNumberController = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ "error": "Phone number is required" });

        const phoneNumberRegex = /^\d{11}$/;
        if (!phoneNumberRegex.test(phoneNumber)) return res.status(400).json({ "error": "phone number must be of 11 digit" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { phoneNumber } }, { new: true });
        if (!user) return res.status(404).json({ "error": "User not found" });

        return res.status(200).json({ "message": "Phone number updated", user });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const userStreetAddressController = async (req, res) => {
    try {
        const { streetAddress } = req.body;
        if (!streetAddress) return res.status(400).json({ "error": "Street address is required" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { "address.streetAddress": streetAddress } }, { new: true });
        if (!user) return res.status(404).json({ "error": "User not found" });

        return res.status(200).json({ "message": "Street Address updated", user });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const userPostalCodeController = async (req, res) => {
    try {
        const { postalCode } = req.body;
        if (!postalCode) return res.status(400).json({ "error": "Postal code is required" });

        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(postalCode)) return res.status(400).json({ "error": "postal code must be a 5 digit number" });

        const user = await User.findByIdAndUpdate(req.user.userId, { $set: { "address.postalCode": postalCode } }, { new: true });
        if (!user) return res.status(404).json({ "error": "User not found" });

        return res.status(200).json({ "message": "Postal Code updated", user });

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
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
        
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

module.exports = {
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
    addToWishListController
}