

const addReviewController = async (req, res) => {
    try {
        
    } catch (error) {
        const result = {
            "error-code": error.code ? error.code : "no error code",
            "erro-message": error.message ? error.message : "Internal server error"
        };
        return res.status(500).json(result); 
    }
}

module.exports = {
    addReviewController
}