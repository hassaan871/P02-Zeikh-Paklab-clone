const { checkoutContoller, confirmOrderController, cancelOrderController } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/checkout', [auth], checkoutContoller);
router.post('/confirm-order', [auth], confirmOrderController);
router.patch('/cancel-order', [auth], cancelOrderController);

module.exports = router;