const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const AppError = require('./AppError');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'general') => {
    try {
        // Check if file exists
        await fs.access(filePath);
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `easyshop/${folder}`,
            use_filename: true,
            unique_filename: true
        });

        // Delete the local file after upload
        await fs.unlink(filePath);

        return result;
    } catch (error) {
        // Clean up the local file if it exists
        try {
            await fs.unlink(filePath);
        } catch (unlinkError) {
            // Ignore unlink errors
        }

        throw new AppError(
            error.message || 'Error uploading file to Cloudinary',
            error.http_code || 500
        );
    }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;

        // Extract public ID from URL if full URL is provided
        if (publicId.startsWith('http')) {
            const urlParts = publicId.split('/');
            const fileName = urlParts[urlParts.length - 1];
            publicId = `easyshop/${fileName.split('.')[0]}`;
        }

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new AppError(
            error.message || 'Error deleting file from Cloudinary',
            error.http_code || 500
        );
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
