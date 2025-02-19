const Smartwatch = require('../models/smartwatch.model');
const { uploadOnCloudinary } = require('../utils/cloudinary.util');

const addSmartWatchProductController = async (req, res) => {
    try {
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

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const addSmartWatchImageController = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ "error": "file not provided to be uplaoded" });
        if (!req.body.smartwatchId) return res.status(400).json({ "error": "smartwatch id not provided" });

        const upload = await uploadOnCloudinary(req.file.path);
        const smartwatch = await Smartwatch.findOneAndUpdate({ _id: req.body.smartwatchId }, { $set: { "image": upload.url } });
        if (!smartwatch) return res.status(404).json({ "error": "smartwatch not found" });

        return res.status(200).json({ "success": "Image uploaded successfully", smartwatch });
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllSmartWatchesController = async (req, res) => {
    try {
        const smartwatches = await Smartwatch.find();
        if(!smartwatches) return res.status(404).json(smartwatches);

        return res.status(200).json(smartwatches);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const searchSmartwatchController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ "error": "must required smartwatch name to be searched" });
        
        const smartwatch = await Smartwatch.findOne({ name });
        if(!smartwatch) return res.status(404).json({"error": "no smartwatch found"});

        return res.status(200).json(smartwatch);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const softDeleteSmartwatchController = async (req, res) => {
    try {
        const smartwatch = await Smartwatch.findOneAndUpdate({"_id": req.body.smartwatchId}, { $set: {isDeleted: true}},{new: true});
        if(!smartwatch) return res.status(404).json({"error": "Smartwatch not found. Invalid smartwatchId"});

        return res.status(200).json({"success": "Smartwatch softly deleted", smartwatch});

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

module.exports = {
    addSmartWatchProductController,
    addSmartWatchImageController,
    getAllSmartWatchesController,
    searchSmartwatchController,
    softDeleteSmartwatchController
}