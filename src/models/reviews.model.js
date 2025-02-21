const mongoose = require('mongoose');

const reviews = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    image: [
        {
            type: String
        }
    ]
}, {timestamps: true});

const Reviews = mongoose.model('Review', reviews);