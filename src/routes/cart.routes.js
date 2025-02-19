const { addToCartController } = require('../controllers/cart.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/add-to-cart', [auth], addToCartController);

module.exports = router;