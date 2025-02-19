const { addToCartController, deleteFromCartController } = require('../controllers/cart.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.put('/add-to-cart', [auth], addToCartController);
router.put('/delete-from-cart', [auth], deleteFromCartController);

module.exports = router;