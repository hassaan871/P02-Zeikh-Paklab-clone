const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: [
            {
                laptop: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Laptop'
                },
                quantity: {
                    type: Number,
                    required: true
                }

            },
            {
                smartwatch: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Smartwatch'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;