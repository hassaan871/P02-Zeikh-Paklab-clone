const Smartwatch = require('../models/smartwatch.model');

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

const addSmartWatchImageController = (req, res) => {
    try {
        
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
    addSmartWatchImageController
}