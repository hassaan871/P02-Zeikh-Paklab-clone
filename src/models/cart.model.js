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
                ref: 'Laptop'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        },
        ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;