const Joi = require('joi');

const validateUser = (user) => {
    const userSchema = Joi.object({
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    });
    return userSchema.validate(user);
}

const validateLoginUser = (loginUser) => {
    const loginUserSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    });
    return loginUserSchema.validate(loginUser);
}

module.exports = {
    validateUser,
    validateLoginUser
}