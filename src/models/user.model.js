const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const user = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    newsLetter: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
    },
    address: {
        streetAddress: {
            type: String
        },
        country: {
            type: String,
            default: "Pakistan",
            required: true
        },
        city: {
            type: String
        },
        postalCode: {
            type: String
        },
        province: {
            type: String,
            enum: ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "Azad-Kashmir"],
            required: function () { return this.country === "Pakistan" }
        }
    }
}, { timestamps: true });

user.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
}

const User = mongoose.model('User', user);
module.exports = User;