const User = require('../models/user.model');

const userSignupController = async (req, res) => {
    try {
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save();
        const {password, ...withoutPassword} =  user._doc;
        return res.status(200).json(withoutPassword);
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