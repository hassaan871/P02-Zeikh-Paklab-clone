const jwt = require('jsonwebtoken');

const auth = (req, res, next) =>{
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).json({"error":"Access denied. No token provided"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { userId: decoded._id };
        next();
        
    } catch (error) {
        return res.status(401).json({"auth error" :error});
    }
}

module.exports = auth;