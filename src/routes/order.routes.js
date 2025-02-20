const { checkout } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.get('/checkout', [auth], checkout);

module.exports = router;