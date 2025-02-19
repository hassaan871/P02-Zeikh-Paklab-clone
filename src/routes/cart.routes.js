const { addToCartController, deleteFromCartController, getCartController } = require('../controllers/cart.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.put('/add-to-cart', [auth], addToCartController);
router.put('/delete-from-cart', [auth], deleteFromCartController);
router.get('/get-cart', [auth], getCartController);

module.exports = router;