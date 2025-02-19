const Cart = require('../models/cart.model');

const addToCartController = async (req, res) => {
    try {
        const {laptopId, smartwatchId, laptopQnty, smartwatchQnty} = req.body;
        if( !laptopId && !smartwatchId) return res.status(400).json({"error":"Nothing to add in cart"});

        let cart = await Cart.findOne({
            userId: req.user.userId
        });
        if(!cart) cart = await Cart.create({userId: req.user.userId, product: []});

        if (cart.product === null) cart.product = [];
        
        if(laptopId){
            const existingLaptop = cart.product.find(product => product.itemId.toString() === laptopId);
            if( existingLaptop ){
                existingLaptop.quantity += laptopQnty;
            } else {
                cart.product.push({
                    itemId: laptopId,
                    quantity: laptopQnty
                });
            }     
        }

        if (smartwatchId){
            const existingSmartWatch = cart.product.find(product => product.itemId.toString() === smartwatchId);
            if( existingSmartWatch ){
                existingSmartWatch.quantity += smartwatchQnty;
            }else{
                cart.product.push({
                    itemId: smartwatchId,
                    quantity: smartwatchQnty
                });
            }
        }

        await cart.save();
        return res.status(201).json({"success": "Item added to cart", cart});
    
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
    deleteFromCartController
}