const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'product.category'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            category: {
                type: String,
                require: true,
                enum: ['Laptop', 'Smartwatch']
            }
        },
    ],
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;