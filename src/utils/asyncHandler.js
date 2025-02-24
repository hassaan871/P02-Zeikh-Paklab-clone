const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                "error-code": error.code || "no error code",
                "error-message": error.message || "Internal server error"
            });    
        }
    }
}

module.exports = asyncHandler;