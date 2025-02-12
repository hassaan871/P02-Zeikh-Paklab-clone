const {
    loginAdminController,
    makeAdminController,
    getAllUsersController
} = require('../controllers/admin.controller');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/login-admin', loginAdminController);

//protected routes
router.get('/get-all-users', [auth], getAllUsersController);
router.post('/make-admin', [auth], makeAdminController);

module.exports = router;