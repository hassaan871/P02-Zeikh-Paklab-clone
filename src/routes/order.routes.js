const { checkout } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/chekout', [auth], checkout);

modult.exports = router;