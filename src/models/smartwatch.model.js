const mongoose = require('mongoose');

const smartwatch = new mongoose.Schema({
    image: {
        type: String,
        // required: true
    },
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
        type: String,
        required: true
    },
    specifications: {
        brand: {
            type: String,
            required: true
        },
        series: {
            type: String
        },
        dialSize: {
            type: String
        },
        screenType: {
            type: String
        },
        waterProtection: {
            type: Boolean,
            required: true,
            default: false
        },
        siriControl: {
            type: Boolean
        },
        operatingSystem : {
            type: String,
            required: true
        },
        color: {
            type: String
        },
        warranty: {
            type: String,
            requried: true,
            deafult: "No"
        },
        sensors: {
            type: String,
        }
    },
    details: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Smartwatch = mongoose.model('Smartwatch', smartwatch);
module.exports = Smartwatch;