const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { validateLoginUser } = require('../validations/user.validations');

const loginAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = validateLoginUser({email, password});
        if (error) return res.status(401).json({"error": error.details[0].message });

        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({"error": "Invalid email"});

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) return res.status(401).json({"error": "Invalid password"});

        if(!user.isAdmin) return res.status(401).json({"error": "Access denied. Only admins are allowed..."});

        const token = user.generateAuthToken();
        return res.status(200).json({ token });

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

const getAllUsersController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if(!user.isAdmin) return res.status(401).json({"error":"unauthorized access"});

        const users = await User.find();
        const result = [];
        users.map((user)=>{const {password, resetPasswordToken, resetPasswordExpires, ...sanatizedUser} = user._doc;
        if(!user._doc.superAdmin) result.push(sanatizedUser)});
        console.log(result);
        
        return res.status(200).json(result);

    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result);
    }
}

module.exports = {
    loginAdminController,
    getAllUsersController
}