const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["Paid","COD"]
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["processing", "pending", "shipped", "delivered", "canceled"]
    }


}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;