const userRoutes = require('./user.routes');
const express = require('express');
const router = express.Router();

router.use('/v1/user', userRoutes);

module.exports = router;

