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
    }
}, { timestamps: true });

user.methods.generateAuthToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
}

const User = mongoose.model('User', user);
module.exports = User;