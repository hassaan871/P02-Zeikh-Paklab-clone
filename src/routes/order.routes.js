const { checkoutContoller, confirmOrderController } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.get('/checkout', [auth], checkoutContoller);
router.post('/confirm-order', [auth], confirmOrderController);

module.exports = router;