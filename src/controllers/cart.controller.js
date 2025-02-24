const Cart = require('../models/cart.model');
const Laptop = require('../models/laptop.model');
const SmartWatch = require('../models/smartwatch.model');

const asyncHandler = require('../utils/asyncHandler');

const addToCartController = async (req, res) => {

        const { laptopId, smartwatchId, laptopQnty, smartwatchQnty } = req.body;
        if (!laptopId && !smartwatchId) return res.status(400).json({ "error-message": "Nothing to add in cart" });

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
                    quantity: laptopQnty,
                    category: "Laptop"
                });
            }
        }

        if (smartwatchId) {
            const existingSmartWatch = cart.product.find(product => product.itemId.toString() === smartwatchId);
            if (existingSmartWatch) {
                existingSmartWatch.quantity += smartwatchQnty;
            } else {
                cart.product.push({
                    itemId: smartwatchId,
                    quantity: smartwatchQnty,
                    category: "Smartwatch"
                });
            }
        }

        await cart.save();
        return res.status(201).json({ "success-message": "Item added to cart", cart });
}

const deleteFromCartController = async (req, res) => {

        const { laptopId, smartwatchId, laptopQnty, smartwatchQnty } = req.body;
        if (!laptopId && !smartwatchId) return res.status(400).json({ "error-message": "Need product id(laptopId or smartwatchId) to delete from the cart" });

        const cart = await Cart.findOne({
            userId: req.user.userId
        });
        if (cart.product === null) return res.status(404).json({ "error-message": "no product found. Cart is already empty" });

        if (laptopId) {
            const existingLaptop = cart.product.find(product => product.itemId.toString() === laptopId);
            if (existingLaptop) {
                if(existingLaptop.quantity-laptopQnty < 0){
                    return res.status(400).json({"error-message":"you cannot delete more than in your cart"});
                }else{
                    existingLaptop.quantity -= laptopQnty;
                    if(existingLaptop.quantity === 0){
                        cart.product = cart.product.filter(product => product.itemId.toString !== laptopId);
                    }
                }
            } else {
                return res.status(400).json({"error-message": "Laptop not found. Invalid Laptop ID"});
            }
        }

        if (smartwatchId) {
            const existingSmartWatch = cart.product.find(product => product.itemId.toString() === smartwatchId);
            if (existingSmartWatch) {
                if(existingSmartWatch.quantity-smartwatchQnty < 0){
                    return res.status(400).json({"error-message":"you cannot delete more than in your cart"});
                }else{
                    existingSmartWatch.quantity -= smartwatchQnty;
                    if(existingSmartWatch.quantity === 0){
                        cart.product = cart.product.filter(product => product.itemId.toString !== smartwatchId);
                    }
                }
            } else {
                return res.status(400).json({"error-message": "Smartwatch not found. Invalid SmartWatch ID"});
            }
        }

        await cart.save();
        return res.status(201).json({ "success-message": "Item removed from the cart", cart });
}

const getCartController = async (req, res) => {

        const {userId} = req.user;

        const cart = await Cart.findOne({ userId });
        if(!cart) return res.status(404).json({"error-message": "cart of the user not found."});

        let result = [];
        for (const item of cart.product) {
                if(item.category === 'Laptop'){
                    const laptop = await Laptop.findById(item.itemId);
                    
                    const product = {
                        "item-name": laptop.name,
                        "quanity": item.quantity,
                        "item-price": laptop.price,
                        "total-price": laptop.price*item.quantity
                    }
                    result.push(product);
                }
                if(item.category === 'Smartwatch'){
                    const smartwatch = await SmartWatch.findById(item.itemId);
                    
                    const product = {
                        "item-name": smartwatch.name,
                        "quantity": item.quantity,
                        "item-price": smartwatch.price,
                        "total-price": smartwatch.price*item.quantity
                    }
                    result.push(product);
                }
            }
            
        return res.status(200).json({cart: result });        
}

module.exports = {
    addToCartController: asyncHandler(addToCartController),
    deleteFromCartController: asyncHandler(deleteFromCartController),
    getCartController: asyncHandler(getCartController)
}