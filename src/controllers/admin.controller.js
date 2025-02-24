const User = require('../models/user.model');
const Order = require('../models/order.model');
const asyncHandler = require('../utils/asyncHandler');

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

        const { email, password } = req.body;

        const { error } = validateLoginUser({ email, password });
        if (error) return res.status(401).json({ "error-message": error.details[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ "error-message": "Invalid email" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ "error-message": "Invalid password" });

        if (!user.isAdmin) return res.status(401).json({ "error-message": "Access denied. Only admins are allowed..." });

        const token = user.generateAuthToken();
        return res.status(200).json({ token });
}

const makeAdminController = async (req, res) => {

        if (!req.body.email && !req.body.userId) return res.status(400).json({ "error-message": "Email or userId is required to perform the action" });

        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ "error-message": "User not found" });

            if (user.superAdmin) return res.status(401).json({ "ERROR": "You cannot edit or view SUPER ADMIN" });

            user.isAdmin = true;
            await user.save();

            return res.status(200).json({ "success-message": `${user.email} is now admin` });
        }
        if (req.body.userId) {
            const user = await User.findOne({ _id: req.body.userId });
            if (!user) return res.status(404).json({ "error-message": "User not found" });

            if (user.superAdmin) return res.status(401).json({ "ERROR": "You cannot edit or view SUPER ADMIN" });

            user.isAdmin = true;
            await user.save();

            return res.status(200).json({ "success-message": `${user.email} is now admin` });
        }
}

const getAllUsersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const users = await User.find();
        const result = [];
        users.map((user) => {
            const { password, resetPasswordToken, resetPasswordExpires, ...sanatizedUser } = user._doc;
            if (!user._doc.superAdmin) result.push(sanatizedUser)
        });
        console.log(result);

        return res.status(200).json(result);
}

const createLaptopProductController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        await addLaptopProductController(req, res);
}

const uploadLaptopImageController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        await addLaptopImageController(req, res);
}

const createSmartWatchProductController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        await addSmartWatchProductController(req, res);
}

const uploadSmartWatchImageController = async (req, res) => {
    
        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        await addSmartWatchImageController(req, res);
}

const deleteLaptopController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access. " });

        await softDeleteLaptopController(req, res);
}

const deleteSmartwatchController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        await softDeleteSmartwatchController(req, res);
}

const getAllOrdersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const allOrders = await Order.find();
        if(!allOrders) return res.status(404).json({"error-message": "not a single order found"});

        return res.status(200).json(allOrders);
}

const getAllCanceledOrdersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const canceledOrders = await Order.find({orderStatus: "canceled"});
        if(!canceledOrders) return res.status(404).json({"error-message":"not a single Canceled order"});

        return res.status(200).json(canceledOrders);
}

const getAllDeliveredOrdersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const deliveredOrders = await Order.find({orderStatus: "delivered"});
        if(!deliveredOrders) return res.status(404).json({"error-message":"not a single order Delivered"});

        return res.status(200).json(deliveredOrders);
}

const getAllShippedOrdersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const shippedOrders = await Order.find({orderStatus: "shipped"});
        if(!shippedOrders) return res.status(404).json({"error-message":"not a single order shipped"});

        return res.status(200).json(shippedOrders);
}

const getAllPendingOrdersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const pendingOrders = await Order.find({orderStatus: "pending"});
        if(!pendingOrders) return res.status(404).json({"error-message":"not a single pending order"});

        return res.status(200).json(pendingOrders);
}

const getAllProcessingOrdersController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const processingOrders = await Order.find({orderStatus: "processing"});
        if(!processingOrders) return res.status(404).json({"error-message":"not a single order processing"});

        return res.status(200).json(processingOrders);
}

const updateOrderStatusController = async (req, res) => {

        const user = await User.findOne({ _id: req.user.userId });
        if (!user.isAdmin) return res.status(401).json({ "error-message": "Unauthorized Access." });

        const {orderId, orderStatus} = req.body;
        if((!orderId || !orderStatus)) return res.status(400).json({"error-message": "orderId and orderStatus required!"});

        const order = await Order.findOne({_id: orderId});
        order.orderStatus = orderStatus;
        await order.save();

        return res.status(200).json({"success-message": `orderStatus updated to ${orderStatus}`, order});
}


module.exports = {
    loginAdminController: asyncHandler(loginAdminController),
    makeAdminController: asyncHandler(makeAdminController),
    getAllUsersController: asyncHandler(getAllUsersController),
    createLaptopProductController: asyncHandler(createLaptopProductController),
    uploadLaptopImageController: asyncHandler(uploadLaptopImageController),
    createSmartWatchProductController: asyncHandler(createSmartWatchProductController),
    uploadSmartWatchImageController: asyncHandler(uploadSmartWatchImageController),
    deleteLaptopController: asyncHandler(deleteLaptopController),
    deleteSmartwatchController: asyncHandler(deleteSmartwatchController),
    getAllOrdersController: asyncHandler(getAllOrdersController),
    getAllCanceledOrdersController: asyncHandler(getAllCanceledOrdersController),
    getAllDeliveredOrdersController: asyncHandler(getAllDeliveredOrdersController),
    getAllShippedOrdersController: asyncHandler(getAllShippedOrdersController),
    getAllPendingOrdersController: asyncHandler(getAllPendingOrdersController),
    getAllProcessingOrdersController: asyncHandler(getAllProcessingOrdersController),
    updateOrderStatusController: asyncHandler(updateOrderStatusController)
}