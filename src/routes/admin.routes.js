const {
    loginAdminController,
    makeAdminController,
    getAllUsersController,
    createLaptopProductController,
    uploadLaptopImageController,
    createSmartWatchProductController,
    uploadSmartWatchImageController
} = require('../controllers/admin.controller');

const { upload } = require('../middlewares/multer.middleware');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/login-admin', loginAdminController);

//protected routes
router.get('/get-all-users', [auth], getAllUsersController);
router.post('/make-admin', [auth], makeAdminController);
router.post('/create-laptop-product', [auth], createLaptopProductController);
router.post('/create-smartwatch-product', [auth], createSmartWatchProductController);
router.post('/upload-laptop-image', [auth, upload.single("laptop-image")],  uploadLaptopImageController);
router.post('/upload-smartwatch-image', [auth, upload.single("smartwatch-image")], uploadSmartWatchImageController);

module.exports = router;