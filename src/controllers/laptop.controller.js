const Laptop = require('../models/laptop.model');

const addLaptopProductController = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
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
            details
        } = req.body;

        const existingLaptop = await Laptop.findOne({name});
        if(existingLaptop) return res.status(409).json({"error-message": "Laptop already registered"});

        const laptop = await Laptop.create({
            name,
            description,
            price,
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
            details
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



module.exports = {
    addLaptopProductController
}