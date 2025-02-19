const Cart = require('../models/cart.model');

const createCart = async (userId) => {
    try {
        const cart = await Cart.create({
            userId
        });
        return cart;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createCart
}