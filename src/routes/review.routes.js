const {
    addReviewController,
    updateReviewController,
    deleteReviewController
} = require('../controllers/review.controller');

const { upload } = require('../middlewares/multer.middleware');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/add-review', [auth, upload.single("image")], addReviewController);
router.post('/update-review', [auth, upload.single("image")], updateReviewController);
router.delete('/delete-review', [auth], deleteReviewController);

module.exports = router;