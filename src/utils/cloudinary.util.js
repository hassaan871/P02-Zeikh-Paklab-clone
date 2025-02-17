const { v2 } = require("cloudinary");
const fs = require('fs');

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINAY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const upload = await cloudinay.uploader.upload(localFilePath, { resource_type: "auto"});
        fs.unlink(localFilePath);
        return upload;
    } catch (error) {
        fs.unlink(localFilePath);
        console.error(error);
        return null;
    }
}

module.exports = {
    uploadOnCloudinary
}