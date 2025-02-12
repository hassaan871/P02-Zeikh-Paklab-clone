const {
    loginAdmin,
    getAllUsers
} = require('../controllers/admin.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/login-admin', loginAdmin);

//protected routes
router.get('/get-all-users', [auth], getAllUsers);

module.exports = router;