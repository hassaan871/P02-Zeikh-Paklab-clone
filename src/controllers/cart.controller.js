const Cart = require('../models/cart.model');

const addToCartController = (req, res) => {
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
    addToCartController
}