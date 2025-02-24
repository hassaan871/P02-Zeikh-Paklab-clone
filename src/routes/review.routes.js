const {
    addReviewController,
    updateReviewController,
    deleteReviewController
} = require('../controllers/review.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/add-review', [auth], addReviewController);
router.post('/update-review', [auth], updateReviewController);
router.delete('/delete-review', [auth], deleteReviewController);

module.exports = router;