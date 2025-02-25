const Laptop = require('../models/laptop.model');

const { uploadOnCloudinary } = require('../utils/cloudinary.util');
const asyncHandler = require('../utils/asyncHandler');

const addLaptopProductController = async (req, res) => {

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
}

const addLaptopImageController = async (req, res) => {

        if (!req.file) return res.status(400).json({ "error-message": "file not provided to be uploaded" });
        if (!req.body.laptopId) return res.status(400).json({ "error-message": "Laptop id not provided" });

        const upload = await uploadOnCloudinary(req.file.path);
        const laptop = await Laptop.findOneAndUpdate(
                { _id: req.body.laptopId },
                { $set: { "image": upload.url } },
                { new: true }
        );
        if (!laptop) return res.status(404).json({ "error-message": "Laptop not found" });

        return res.status(200).json({ "success-message": "Image uploaded successfully", laptop });
}

const getAllLaptopsController = async (req, res) => {

        const laptops = await Laptop.find();
        if (!laptops) return res.status(404).json({ "error-message": "no laptop found" });

        return res.status(200).json(laptops);
}

const searchLaptopController = async (req, res) => {

        const { name } = req.body;
        if (!name) return res.status(400).json({ "error-message": "must required laptop name to be searched" });

        const laptop = await Laptop.findOne({ name });
        if (!laptop) return res.status(404).json({ "error-message": "no laptop found" });

        return res.status(200).json(laptop);
}

const getAllNewLaptopsController = async (req, res) => {

        const newLaptops = await Laptop.find({ "specifications.condition": "new" });
        if (!newLaptops) return res.status(404).json({ "error-message": "no new laptop found" });

        return res.status(200).json(newLaptops);
}

const getAllUsedLaptopsController = async (req, res) => {

        const usedLaptops = await Laptop.find({ "specifications.condition": "used" });
        if (!usedLaptops) return res.status(404).json({ "error-message": "no used laptop found" });

        return res.status(200).json(usedLaptops);
}

const softDeleteLaptopController = async (req, res) => {

        const laptop = await Laptop.findOneAndUpdate(
                { "_id": req.body.laptopId },
                { $set: { isDeleted: true } },
                { new: true }
        );
        if (!laptop) return res.status(404).json({ "error-message": "Laptop not found. Invalid LaptopId" });

        return res.status(200).json({ "success-message": "Laptop softly deleted", laptop });
}

module.exports = {
        addLaptopProductController: asyncHandler(addLaptopProductController),
        addLaptopImageController: asyncHandler(addLaptopImageController),
        getAllLaptopsController: asyncHandler(getAllLaptopsController),
        searchLaptopController: asyncHandler(searchLaptopController),
        getAllNewLaptopsController: asyncHandler(getAllNewLaptopsController),
        getAllUsedLaptopsController: asyncHandler(getAllUsedLaptopsController),
        softDeleteLaptopController: asyncHandler(softDeleteLaptopController)
}