const {
    loginAdminController,
    makeAdminController,
    removeFromAdminController,
    getAllUsersController,
    createLaptopProductController,
    uploadLaptopImageController,
    createSmartWatchProductController,
    uploadSmartWatchImageController,
    deleteLaptopController,
    deleteSmartwatchController,
    getAllOrdersController,
    getAllCanceledOrdersController,
    getAllDeliveredOrdersController,
    getAllShippedOrdersController,
    getAllPendingOrdersController,
    getAllProcessingOrdersController,
    updateOrderStatusController
} = require('../controllers/admin.controller');

const { upload } = require('../middlewares/multer.middleware');

const auth = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.post('/login-admin', loginAdminController);

//protected routes
router.get('/get-all-users', [auth], getAllUsersController);
router.patch('/make-admin', [auth], makeAdminController);
router.patch('/remove-from-admin', [auth], removeFromAdminController);
router.post('/create-laptop-product', [auth], createLaptopProductController);
router.post('/create-smartwatch-product', [auth], createSmartWatchProductController);
router.patch('/upload-laptop-image', [auth, upload.single("laptop-image")],  uploadLaptopImageController);
router.patch('/upload-smartwatch-image', [auth, upload.single("smartwatch-image")], uploadSmartWatchImageController);
router.patch('/delete-laptop', [auth], deleteLaptopController);
router.patch('/delete-smartwatch', [auth], deleteSmartwatchController);
router.get('/get-all-orders', [auth], getAllOrdersController);
router.get('/get-all-canceled-orders', [auth], getAllCanceledOrdersController);
router.get('/get-all-delivered-orders', [auth], getAllDeliveredOrdersController);
router.get('/get-all-shipped-orders', [auth], getAllShippedOrdersController);
router.get('/get-all-pending-orders', [auth], getAllPendingOrdersController);
router.get('/get-all-processing-orders', [auth], getAllProcessingOrdersController);
router.patch('/update-order-status', [auth], updateOrderStatusController);

module.exports = router;