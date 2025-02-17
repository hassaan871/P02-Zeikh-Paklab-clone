const { getAllLaptopsController, searchLaptopController, getAllUsedLaptopsController, getAllNewLaptopsController } = require('../controllers/laptop.controller');
const { getAllSmartWatchesController, searchSmartwatchController } = require('../controllers/smartwatch.controller');

const express = require('express');
const router = express.Router();

router.get('/get-all-laptops', getAllLaptopsController);
router.get('/get-all-smartwatches', getAllSmartWatchesController);
router.post('/search-laptop', searchLaptopController);
router.post('/search-smartwatch', searchSmartwatchController);
router.get('/get-all-used-laptops', getAllUsedLaptopsController);
router.get('/get-all-new-laptops', getAllNewLaptopsController);

module.exports = router;