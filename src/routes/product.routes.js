const { getAllLaptops } = require('../controllers/laptop.controller');
const { getAllSmartWatches } = require('../controllers/smartwatch.controller');

const express = require('express');
const router = express.Router();

router.get('/get-all-laptops', getAllLaptops);
router.get('/get-all-smartwatches', getAllSmartWatches);

module.exports = router;