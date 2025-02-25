const Review = require('../models/review.model');
const Order = require('../models/order.model');

const asyncHandler = require('../utils/asyncHandler');

const addReviewController = async (req, res) => {

        const { laptopId, smartwatchId, value, quality, price, review } = req.body;
        if (!laptopId && !smartwatchId) return res.status(400).json({ "error-message": "product Id is required. (smartwatchId or laptopId)" });

        if (!value && !quality && !price && !review) return res.status(400).json({ "error-message": "Reviews details is required." });

        const { userId } = req.user;
        const reviewDocument = {
            userId,
            value,
            quality,
            price,
            review
        };

        if (laptopId) {
            const order = await Order.findOne({
                userId,
                product:{
                    $elemMatch:{
                        itemId: laptopId
                    }
                }    
            });
            if(!order || order.orderStatus !== "delivered") return res.status(400).json(
                {
                    "error-message": "can't add a review to the product not delivered to you"
                }
            );
            reviewDocument.productId = laptopId;
            reviewDocument.category = "Laptop";
        }
        if (smartwatchId) {
            const order = await Order.findOne({
                userId,
                product:{
                    $elemMatch:{
                        itemId: smartwatchId
                    }
                }    
            });
            if(!order || order.orderStatus !== "delivered") return res.status(400).json(
                {
                    "error-message": "can't add a review to the product not delivered to you"
                }
            );
            reviewDocument.productId = smartwatchId;
            reviewDocument.category = "Smartwatch";
        }

        const userReview = await Review.create(reviewDocument);

        return res.status(201).json({ "success-messsage": "review posted successfully", userReview });
}

const updateReviewController = async (req, res) => {
    
        const { productId, value, quality, price, updatedReview } = req.body;
        if (!productId) return res.status(400).json({ "error-message": "productId is required" });

        if (!value && !quality && !price && !review) return res.json(400).json({ "error": "atleast one figure to be updated required" });

        const review = await Review.findOne({ userId, productId });
        if(!review) return res.status(400).json({"error-message": "no reivew to update"});

        if (value) review.value = value;
        if(quality) review.quality = quality;
        if(price) review.price = price;
        if(updatedReview) review.review = updatedReview;

        await review.save();
        return res.status(200).json({"success-message": "review updated succsessfully", review});
}

const deleteReviewController = async (req, res) => {
    
        const { userId } = req.user;

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error-message": "productId is required." });

        const review = await Review.findOne({ userId, productId });
        if (!review) return res.status(404).json({ "error-message": "review not found" });

        if (review.isDeleted) return res.status(400).json({ "error-message": "review already deleted" });

        review.isDeleted = true;
        await review.save();

        return res.status(200).json({ "success-message": "review deleted successfully." });
}

module.exports = {
    addReviewController: asyncHandler(addReviewController),
    updateReviewController: asyncHandler(updateReviewController),
    deleteReviewController: asyncHandler(deleteReviewController)
}