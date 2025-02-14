const { v2 } = require("cloudinary");

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINAY_API_SECRET
});

const uploadOnCloudinary = () => {
    try {
        
    } catch (error) {
        return null;
    }
}

module.exports = {
    uploadOnCloudinary
}