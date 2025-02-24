const Review = require('../models/review.model');

const addReviewController = async (req, res) => {
    try {
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
        console.log(reviewDocument);

        const userReview = await Review.create(reviewDocument);

        return res.status(201).json({ "success": "review posted successfully", userReview });

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

const updateReviewController = async (req, res) => {
    try {
        
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

const deleteReviewController = async (req, res) => {
    try {
        const { userId } = req.user;

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ "error": "productId is required." });
        
        const review = await Review.findOne({ userId, productId});
        if(!review) return res.status(404).json({"error": "review not found"});

        if(review.isDeleted) return res.status(400).json({"error": "review already deleted"});

        review.isDeleted = true;
        await review.save();

        return res.status(200).json({"success": "review deleted successfully."});

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

module.exports = {
    addReviewController,
    updateReviewController,
    deleteReviewController
}