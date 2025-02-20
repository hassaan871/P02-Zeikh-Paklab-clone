const User = require('../models/user.model');
const Order = require('../models/order.model');
const bcrypt = require('bcrypt');
const { validateLoginUser } = require('../validations/user.validations');
const {
    addLaptopProductController,
    addLaptopImageController,
    softDeleteLaptopController
} = require('./laptop.controller');
const {
    addSmartWatchProductController,
    addSmartWatchImageController,
    softDeleteSmartwatchController
} = require('./smartwatch.controller');

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
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        await addLaptopProductController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const uploadLaptopImageController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        await addLaptopImageController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const createSmartWatchProductController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        await addSmartWatchProductController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const uploadSmartWatchImageController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        await addSmartWatchImageController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const deleteLaptopController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access. " });

        await softDeleteLaptopController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const deleteSmartwatchController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access. " });

        await softDeleteSmartwatchController(req, res);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllOrdersController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        const allOrders = await Order.find();
        if(!allOrders) return res.status(404).json({"error": "not a single order"});

        return res.status(200).json(allOrders);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllCanceledOrdersController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        const canceledOrders = await Order.find({orderStatus: "canceled"});
        if(!canceledOrders) return res.status(404).json({"error":"not a single Canceled order"});

        return res.status(200).json(canceledOrders);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllDeliveredOrdersController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error": "Unauthorized Access." });

        const deliveredOrders = await Order.find({orderStatus: "delivered"});
        if(!deliveredOrders) return res.status(404).json({"error":"not a single order Delivered"});

        return res.status(200).json(deliveredOrders);

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
    createLaptopProductController,
    uploadLaptopImageController,
    createSmartWatchProductController,
    uploadSmartWatchImageController,
    deleteLaptopController,
    deleteSmartwatchController,
    getAllOrdersController,
    getAllCanceledOrdersController,
    getAllDeliveredOrdersController
}