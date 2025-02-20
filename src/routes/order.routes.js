const { checkoutContoller, confirmOrderController, cancelOrder } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.get('/checkout', [auth], checkoutContoller);
router.post('/confirm-order', [auth], confirmOrderController);
router.post('/cancel-order', [auth], cancelOrder);

module.exports = router;