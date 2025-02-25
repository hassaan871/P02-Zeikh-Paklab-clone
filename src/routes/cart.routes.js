const { addToCartController, deleteFromCartController, getCartController } = require('../controllers/cart.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/add-to-cart', [auth], addToCartController);
router.delete('/delete-from-cart', [auth], deleteFromCartController);
router.get('/get-cart', [auth], getCartController);

module.exports = router;