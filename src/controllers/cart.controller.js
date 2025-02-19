const Cart = require('../models/cart.model');

const addToCartController = async (req, res) => {
    try {
        const { laptopId, smartwatchId, laptopQnty, smartwatchQnty } = req.body;
        if (!laptopId && !smartwatchId) return res.status(400).json({ "error": "Nothing to add in cart" });

        let cart = await Cart.findOne({
            userId: req.user.userId
        });
        if (!cart) cart = await Cart.create({ userId: req.user.userId, product: [] });

        if (cart.product === null) cart.product = [];

        if (laptopId) {
            const existingLaptop = cart.product.find(product => product.itemId.toString() === laptopId);
            if (existingLaptop) {
                existingLaptop.quantity += laptopQnty;
            } else {
                cart.product.push({
                    itemId: laptopId,
                    quantity: laptopQnty
                });
            }
            cart.product.type = "Laptop";
        }

        if (smartwatchId) {
            const existingSmartWatch = cart.product.find(product => product.itemId.toString() === smartwatchId);
            if (existingSmartWatch) {
                existingSmartWatch.quantity += smartwatchQnty;
            } else {
                cart.product.push({
                    itemId: smartwatchId,
                    quantity: smartwatchQnty
                });
            }
            cart.product.type = "Smartwatch";
        }

        await cart.save();
        return res.status(201).json({ "success": "Item added to cart", cart });

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const deleteFromCartController = async (req, res) => {
    try {
        const { laptopId, smartwatchId, laptopQnty, smartwatchQnty } = req.body;
        if (!laptopId && !smartwatchId) return res.status(400).json({ "error": "Need product id(laptopId or smartwatchId) to delete from the cart" });

        const cart = await Cart.findOne({
            userId: req.user.userId
        });
        if (cart.product === null) return res.status(404).json({ "error": "no product found. Cart is already empty" });

        if (laptopId) {
            const existingLaptop = cart.product.find(product => product.itemId.toString() === laptopId);
            if (existingLaptop) {
                if(existingLaptop.quantity-laptopQnty < 0){
                    return res.status(400).json({"error":"you cannot delete more than in your cart"});
                }else{
                    existingLaptop.quantity -= laptopQnty;
                    if(existingLaptop.quantity === 0){
                        cart.product = cart.product.filter(product => product.itemId.toString !== laptopId);
                    }
                }
            } else {
                return res.status(400).json({"error": "Laptop not found. Invalid Laptop ID"});
            }
        }

        if (smartwatchId) {
            const existingSmartWatch = cart.product.find(product => product.itemId.toString() === smartwatchId);
            if (existingSmartWatch) {
                if(existingSmartWatch.quantity-smartwatchQnty < 0){
                    return res.status(400).json({"error":"you cannot delete more than in your cart"});
                }else{
                    existingSmartWatch.quantity -= smartwatchQnty;
                    if(existingSmartWatch.quantity === 0){
                        cart.product = cart.product.filter(product => product.itemId.toString !== smartwatchId);
                    }
                }
            } else {
                return res.status(400).json({"error": "Smartwatch not found. Invalid SmartWatch ID"});
            }
        }

        await cart.save();
        return res.status(201).json({ "success": "Item removed from the cart", cart });

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getCartController = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await Cart.findOne({ userId });



        
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

module.exports = {
    addToCartController,
    deleteFromCartController,
    getCartController
}