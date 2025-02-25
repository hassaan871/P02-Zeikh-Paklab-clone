const Review = require('../models/review.model');

const asyncHandler = require('../utils/asyncHandler');

const addReviewController = async (req, res) => {

        const { laptopId, smartwatchId, value, quality, price, review } = req.body;
        if (!laptopId && !smartwatchId) return res.status(400).json({ "error": "product Id is required. (smartwatchId or laptopId)" });

        if (!value && !quality && !price && !review) return res.status(400).json({ "error": "Reviews details is required." });

        const { userId } = req.user;
        const reviewDocument = {
            userId,
            value,
            quality,
            price,
            review
        };

        if (laptopId) {
            reviewDocument.productId = laptopId;
            reviewDocument.category = "Laptop";
        }
        if (smartwatchId) {
            reviewDocument.productId = smartwatchId;
            reviewDocument.category = "Smartwatch";
        }

        const userReview = await Review.create(reviewDocument);

        return res.status(201).json({ "success": "review posted successfully", userReview });
}

const updateReviewController = async (req, res) => {
    
        const { productId, value, quality, price, updatedReview } = req.body;
        if (!productId) return res.status(400).json({ "error": "productId is required" });

        if (!value && !quality && !price && !review) return res.json(400).json({ "error": "atleast one figure to be updated required" });

        const review = await Review.findOne({ userId, productId });
        if (value) review.value = value;
        if(quality) review.quality = quality;
        if(price) review.price = price;
        if(updatedReview) review.review = updatedReview;

        await review.save();
        return res.status(200).json({"success": "review updated succsessfully", review});
}

const deleteReviewController = async (req, res) => {
    
        const { userId } = req.user;

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error": "productId is required." });

        const review = await Review.findOne({ userId, productId });
        if (!review) return res.status(404).json({ "error": "review not found" });

        if (review.isDeleted) return res.status(400).json({ "error": "review already deleted" });

        review.isDeleted = true;
        await review.save();

        return res.status(200).json({ "success": "review deleted successfully." });
}

module.exports = {
    addReviewController: asyncHandler(addReviewController),
    updateReviewController: asyncHandler(updateReviewController),
    deleteReviewController: asyncHandler(deleteReviewController)
}