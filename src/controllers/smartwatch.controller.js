const Smartwatch = require('../models/smartwatch.model');
const { uploadOnCloudinary } = require('../utils/cloudinary.util');
const asyncHandler = require('../utils/asyncHandler');

const addSmartWatchProductController = async (req, res) => {

    const {
        name,
        description,
        price,
        specifications: {
            brand,
            series,
            dialSize,
            screenType,
            waterProtection,
            siriControl,
            operatingSystem,
            color,
            warranty,
            sensors
        },
        details,
        quantity
    } = req.body;

    const existingSmartWatch = await Smartwatch.findOne({ name });
    if (existingSmartWatch) return res.status(409).json({ "error-message": "Smartwatch already exists" });

    const smartwatch = await Smartwatch.create({
        name,
        description,
        price,
        specifications: {
            brand,
            series,
            dialSize,
            screenType,
            waterProtection,
            siriControl,
            operatingSystem,
            color,
            warranty,
            sensors
        },
        details,
        quantity
    });

    return res.status(201).json(smartwatch);
}

const addSmartWatchImageController = async (req, res) => {

    if (!req.file) return res.status(400).json({ "error": "file not provided to be uplaoded" });
    if (!req.body.smartwatchId) return res.status(400).json({ "error": "smartwatch id not provided" });

    const upload = await uploadOnCloudinary(req.file.path);
    const smartwatch = await Smartwatch.findOneAndUpdate(
        { _id: req.body.smartwatchId },
        { $set: { "image": upload.url } },
        { new: true }
    );
    if (!smartwatch) return res.status(404).json({ "error": "smartwatch not found" });

    return res.status(200).json({ "success": "Image uploaded successfully", smartwatch });
}

const getAllSmartWatchesController = async (req, res) => {

    const smartwatches = await Smartwatch.find();
    if (!smartwatches) return res.status(404).json(smartwatches);

    return res.status(200).json(smartwatches);
}

const searchSmartwatchController = async (req, res) => {

    const { name } = req.body;
    if (!name) return res.status(400).json({ "error": "must required smartwatch name to be searched" });

    const smartwatch = await Smartwatch.findOne({ name });
    if (!smartwatch) return res.status(404).json({ "error": "no smartwatch found" });

    return res.status(200).json(smartwatch);
}

const softDeleteSmartwatchController = async (req, res) => {

    const smartwatch = await Smartwatch.findOneAndUpdate(
        { "_id": req.body.smartwatchId },
        { $set: { isDeleted: true } },
        { new: true }
    );
    if (!smartwatch) return res.status(404).json({ "error": "Smartwatch not found. Invalid smartwatchId" });

    return res.status(200).json({ "success": "Smartwatch softly deleted", smartwatch });
}

module.exports = {
    addSmartWatchProductController: asyncHandler(addSmartWatchProductController),
    addSmartWatchImageController: asyncHandler(addSmartWatchImageController),
    getAllSmartWatchesController: asyncHandler(getAllSmartWatchesController),
    searchSmartwatchController: asyncHandler(searchSmartwatchController),
    softDeleteSmartwatchController: asyncHandler(softDeleteSmartwatchController)
}