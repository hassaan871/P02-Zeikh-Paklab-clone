const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const express = require('express');
const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/admin', adminRoutes);

module.exports = router;

