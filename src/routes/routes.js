const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const reviewRoutes = require('./review.routes');

const express = require('express');
const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/product', productRoutes);
router.use('/v1/cart', cartRoutes);
router.use('/v1/order', orderRoutes);
router.use('/v1/review', reviewRoutes);

module.exports = router;

