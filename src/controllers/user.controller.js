const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const userSignupController = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        const data = user.toObject();
        delete data.password;
        
        return res.status(200).json(data);
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "error-message": error.message
        };
        return res.status(500).json(result);
    }
}

module.exports = {
    userSignupController
}