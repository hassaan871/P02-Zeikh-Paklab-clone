const Laptop = require('../models/laptop.model');
const { uploadOnCloudinary } = require('../utils/cloudinary.util');

const addLaptopProductController = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            gamingLaptop,
            specifications: {
                brand,
                generation,
                processorType,
                processorSpeed,
                installedRam,
                typeOfRam,
                hardDriveSize,
                hardDriveSpeed,
                opticalDrive,
                typeOfOpticalDrive,
                ssd,
                typeOfHardDrive,
                graphicSeries,
                dedicatedGraphics,
                graphicsMemory,
                typeOfGraphicsMemory,
                switchableGraphics,
                graphicsProcessor,
                backlight,
                screenSize,
                screenSurface,
                screenResolution,
                touchScreen,
                color,
                ram,
                operatingSystem,
                weight,
                fingerPrintReader,
                numericKeyboard,
                backlitKeyboard,
                bluetooth,
                lan,
                lanSpeed,
                wifi,
                wifiType,
                condition,
                usb,
                hdmi,
                camera,
                operatingSystemPrimary,
                maual,
                productPage,
                warranty
            },
            details,
            quantity
        } = req.body;

        const existingLaptop = await Laptop.findOne({ name });
        if (existingLaptop) return res.status(409).json({ "error-message": "Laptop already registered" });

        const laptop = await Laptop.create({
            name,
            description,
            price,
            gamingLaptop,
            specifications: {
                brand,
                generation,
                processorType,
                processorSpeed,
                installedRam,
                typeOfRam,
                hardDriveSize,
                hardDriveSpeed,
                opticalDrive,
                typeOfOpticalDrive,
                ssd,
                typeOfHardDrive,
                graphicSeries,
                dedicatedGraphics,
                graphicsMemory,
                typeOfGraphicsMemory,
                switchableGraphics,
                graphicsProcessor,
                backlight,
                screenSize,
                screenSurface,
                screenResolution,
                touchScreen,
                color,
                ram,
                operatingSystem,
                weight,
                fingerPrintReader,
                numericKeyboard,
                backlitKeyboard,
                bluetooth,
                lan,
                lanSpeed,
                wifi,
                wifiType,
                condition,
                usb,
                hdmi,
                camera,
                operatingSystemPrimary,
                maual,
                productPage,
                warranty
            },
            details,
            quantity
        });

        return res.status(201).json(laptop);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const addLaptopImageController = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ "error": "file not provided to be uploaded" });
        if (!req.body.laptopId) return res.status(400).json({ "error": "Laptop id not provided" });

        const upload = await uploadOnCloudinary(req.file.path);
        const laptop = await Laptop.findOneAndUpdate({ _id: req.body.laptopId }, { $set: { "image": upload.url } });
        if (!laptop) return res.status(404).json({ "error": "Laptop not found" });

        return res.status(200).json({ "success": "Image uploaded successfully", laptop });
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllLaptopsController = async (req, res) => {
    try {
        const laptops = await Laptop.find();
        if (!laptops) return res.status(404).json({ "error": "no laptop found" });

        return res.status(200).json(laptops);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const searchLaptopController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ "error": "must required laptop name to be searched" });

        const laptop = await Laptop.findOne({ name });
        if (!laptop) return res.status(404).json({ "error": "no laptop found" });

        return res.status(200).json(laptop);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllNewLaptopsController = async (req, res) => {
    try {
        const newLaptops = await Laptop.find({ "specifications.condition": "new" });
        if (!newLaptops) return res.status(404).json({ "message": "no new laptop found" });

        return res.status(200).json(newLaptops);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

const getAllUsedLaptopsController = async (req, res) => {
    try {
        const usedLaptops = await Laptop.find({ "specifications.condition": "used" });
        if (!usedLaptops) return res.status(404).json({ "message": "no used laptop found" });

        return res.status(200).json(usedLaptops);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message ? error.message : "Internal server error"
        }
        return res.status(500).json(result);
    }
}

module.exports = {
    addLaptopProductController,
    addLaptopImageController,
    getAllLaptopsController,
    searchLaptopController,
    getAllNewLaptopsController,
    getAllUsedLaptopsController
}