const User = require('../models/user.model');
const { validateUser, validateLoginUser } = require('../validations/user.validations');
const bcrypt = require('bcrypt');

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

        return res.status(201).header("x-auth-token", token).json(data);

    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ "error-message": "Duplicate entry " + error.message })

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

const userAccountInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ "error": "User not found" });

        const { password, ...withoutPassword } = user._doc;
        return res.status(200).json(withoutPassword);

    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }
}

const userPhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if(!phoneNumber) return res.status(400).json({"error": "Phone number is required"});

        const user = await User.findByIdAndUpdate(req.user.userId, {$set: {phoneNumber}}, {new: true});
        if(!user) return res.status(404).json({"error": "User not found"});

        return res.status(200).json({"message": "Phone number updated", user});

    } catch (error) {
        return res.status(500).json({"error": "Internal server error"});
    }
}

const userStreetAddress = async (req, res) => {
    try {
        const { streetAddress } = req.body;
        if(!streetAddress) return res.status(400).json({"error": "Street address is required"});

        const user = await User.findByIdAndUpdate(req.user.userId, {$set: {"address.streetAddress": streetAddress}}, {new: true});
        if(!user) return res.status(404).json({"error": "User not found"});

        return res.status(200).json({"message": "Street Address updated", user})

    } catch (error) {
        return res.status(500).json({"error": "Internal server error"});
    }
}

module.exports = {
    userSignupController,
    userLoginController,
    userAccountInfo,
    userPhoneNumber,
    userStreetAddress
}