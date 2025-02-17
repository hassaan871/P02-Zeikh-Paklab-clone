const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const productRoutes = require('./product.routes');
const express = require('express');
const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/product', productRoutes);

module.exports = router;

