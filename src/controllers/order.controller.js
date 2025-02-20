const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Laptop = require('../models/laptop.model');
const SmartWatch = require('../models/smartwatch.model');
const Order = require('../models/order.model');

const checkoutContoller = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await User.findById(userId);   

        const cart = await Cart.findOne({ userId });
        if(!cart) return res.status(404).json({"error": "cart of the user not found."});

        let totalBill = 0;
        let result = [];
        userdetails = {
            "name": `${user.firstname} ${user.lastname}`,
            "phone-number": user.phoneNumber,
            "address": user.address.streetAddress,
            "city": user.address.city
        }
        result.push(userdetails);

        for (const item of cart.product) {
                if(item.category === 'Laptop'){
                    const laptop = await Laptop.findById(item.itemId);                    
                    const product = {
                        "item-name": laptop.name,
                        "quanity": item.quantity,
                        "item-price": laptop.price,
                        "total-price": laptop.price*item.quantity
                    }
                    totalBill += (laptop.price*item.quantity);
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
                    totalBill += (smartwatch.price*item.quantity);
                    result.push(product);
                }
            }
            cart.totalAmount = totalBill;
            await cart.save();
            result.push({totalBill});                
            return res.status(200).json(result);
            
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const confirmOrderController = async (req, res) => {
    try {
        const {userId} = req.user;

        const {paymentMethod} = req.body;
        if(!paymentMethod) return res.status(400).json({"error": "paymentMethod is required"});

        const cart = await Cart.findOne({userId});

        const order = await Order.create({
            userId,
            totalAmount: cart.totalAmount,
            paymentStatus: paymentMethod,
            orderStatus: "processing"
        });
        return res.status(201).json({"success": "Order placed successfully", order});
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result); 
    }
}

const cancelOrder = async (req, res) => {
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
    checkoutContoller,
    confirmOrderController,
    cancelOrder
}