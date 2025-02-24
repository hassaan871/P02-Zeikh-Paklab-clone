const {
    addReviewController
} = require('../controllers/review.controller');
const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/add-review', [auth], addReviewController);
router.delete('/delete-review', [auth], );

module.exports = router;