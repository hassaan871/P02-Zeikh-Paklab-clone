const { getAllLaptopsController, searchLaptopController } = require('../controllers/laptop.controller');
const { getAllSmartWatchesController, searchSmartwatchController } = require('../controllers/smartwatch.controller');

const express = require('express');
const router = express.Router();

router.get('/get-all-laptops', getAllLaptopsController);
router.get('/get-all-smartwatches', getAllSmartWatchesController);
router.post('/search-laptop', searchLaptopController);
router.post('/search-smartwatch', searchSmartwatchController);

module.exports = router;