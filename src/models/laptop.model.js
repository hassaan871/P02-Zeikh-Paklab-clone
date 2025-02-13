const mongoose = require('mongoose');

const laptop = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required : true
    },
    specifications: {
        brand:{
            type: String,
            enum: ["Asus", "Acer", "Dell", "HP", "Lenovo", "MSI", "Microsoft Surface", "Razer Blade"],
            required: true
        },
        generation:{
            type: String,
            required: true
        },
        processorType: {
            type: String,
            required: true
        },
        processorSpeed: {
            type: String,
            required: true
        },
        installedRam: {
            type: Number,
            enum: [4, 8, 16, 32, 64],
            required: true
        },
        typeOfRam: {
            type: String,
            required: true
        },
        hardDriveSize: {
            type: String,
            required: true
        },
        hardDriveSpeed: {
            type: String
        },
        opticalDrive: {
            type: Boolean
        },
        typeOfOpticalDrive: {
            type: String
        },
        ssd: {
            type: String
        },
        typeOfHardDrive: {
            type: String
        },
        graphicSeries: {
            type: String
        },
        dedicatedGraphics: {
            type: Boolean
        },
        graphicsMemory: {
            type: String
        },
        typeOfGraphicsMemory: {
            type: String
        },
        switchableGraphics: {
            type: Boolean
        },
        graphicsProcessor: {
            type: String
        },
        backlight: {
            type: String
        },
        screenSize: {
            type: String
        },
        screenSurface: {
            type: String
        },
        screenResolution: {
            type: String
        },
        touchScreen: {
            type: Boolean
        },
        color: {
            type: String
        },
        ram: {
            type: String,
            enum: [4, 8, 16, 32, 64],
            required: true
        },
        operatingSystem:{
            type: String,
            required: true
        },
        weight: {
            type: String
        },
        fingerPrintReader: {
            type: Boolean
        },
        numericKeyboard: {
            type: Boolean
        },
        backlitKeyboard: {
            type: String
        },
        bluetooth: {
            type: Boolean
        },
        lan: {
            type: Boolean
        },
        lanSpeed: {
            type: String
        },
        wifi: {
            type: Boolean
        },
        wifiType: {
            type: String
        },
        condition: {
            type: String,
            enum: ['new', 'used'],
            required: true
        },
        usb: {
            type: String
        },
        hdmi: {
            type: String
        },
        camera: {
            type: String
        },
        operatingSystemPrimary: {
            type: String
        },
        maual: {
            type: String
        },
        productPage: {
            type: String
        },
        warranty: {
            type: String
        }

    },
    details: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }

}, { timestamps: true });

const Laptop = mongoose.model('Laptop', laptop);
module.exports = Laptop;