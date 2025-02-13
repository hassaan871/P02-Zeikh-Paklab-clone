const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { validateLoginUser } = require('../validations/user.validations');
const { addLaptopProductController } = require('./laptop.controller');

const loginAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = validateLoginUser({ email, password });
        if (error) return res.status(401).json({ "error": error.details[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ "error": "Invalid email" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ "error": "Invalid password" });

        if (!user.isAdmin) return res.status(401).json({ "error": "Access denied. Only admins are allowed..." });

        const token = user.generateAuthToken();
        return res.status(200).json({ token });

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

const makeAdminController = async (req, res) => {
    try {
        if (!req.body.email && !req.body.userId) return res.status(400).json({ "error": "Email or userId is required to perform the action" });

        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ "error": "User not found" });

            if (user.superAdmin) return res.status(401).json({ "ERROR": "You cannot edit or view SUPER ADMIN" });

            user.isAdmin = true;
            await user.save();

            return res.status(200).json({ "success": `${user.email} is now admin` });
        }
        if (req.body.userId) {
            const user = await User.findOne({ _id: req.body.userId });
            if (!user) return res.status(404).json({ "error": "User not found" });

            if (user.superAdmin) return res.status(401).json({ "ERROR": "You cannot edit or view SUPER ADMIN" });

            user.isAdmin = true;
            await user.save();

            return res.status(200).json({ "success": `${user.email} is now admin` });
        }
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

const getAllUsersController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        const users = await User.find();
        const result = [];
        users.map((user) => {
            const { password, resetPasswordToken, resetPasswordExpires, ...sanatizedUser } = user._doc;
            if (!user._doc.superAdmin) result.push(sanatizedUser)
        });
        console.log(result);

        return res.status(200).json(result);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

const createLaptopProductController = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.userId});
        if(!user.isAdmin) return res.status(401).json({"error": "Unauthorized Access."});

        addLaptopProductController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

module.exports = {
    loginAdminController,
    makeAdminController,
    getAllUsersController,
    createLaptopProductController
}