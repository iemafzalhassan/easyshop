const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const AppError = require('./AppError');

// Configure Cloudinary
const configureCloudinary = () => {
    // Ensure environment variables are loaded
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    
    // Log configuration status (for debugging)
    console.log('Cloudinary Configuration Status:');
    console.log('- Cloud Name:', CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing');
    console.log('- API Key:', CLOUDINARY_API_KEY ? 'Present' : 'Missing');
    console.log('- API Secret:', CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new AppError(
            'Missing Cloudinary configuration. Please check your environment variables.',
            500
        );
    }

    // Configure Cloudinary with environment variables
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });

    // Verify configuration
    try {
        const testConfig = cloudinary.config();
        if (!testConfig.cloud_name || !testConfig.api_key || !testConfig.api_secret) {
            throw new Error('Configuration verification failed');
        }
    } catch (error) {
        throw new AppError('Failed to configure Cloudinary: ' + error.message, 500);
    }
};

// Try to configure Cloudinary
try {
    configureCloudinary();
} catch (error) {
    console.error('Cloudinary Configuration Error:', error);
    // Don't throw here - let the individual operations handle the error
}

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
            unique_filename: true,
            overwrite: true
        });

        if (!result || !result.secure_url) {
            throw new Error('Failed to get secure URL from Cloudinary');
        }

        // Delete the local file after upload
        await fs.unlink(filePath).catch(console.error);

        return result;
    } catch (error) {
        // Clean up the local file if it exists
        try {
            await fs.unlink(filePath);
        } catch (unlinkError) {
            // Ignore unlink errors
            console.error('Error cleaning up local file:', unlinkError);
        }

        if (error.message.includes('Must supply api_key')) {
            throw new AppError('Invalid Cloudinary API key. Please check your configuration.', 500);
        }

        throw new AppError(
            error.message || 'Error uploading file to Cloudinary',
            error.http_code || 500
        );
    }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicUrl - Public URL of the file to delete
 * @returns {Promise<Object>} Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicUrl) => {
    try {
        if (!publicUrl) {
            throw new AppError('No public URL provided for deletion', 400);
        }

        // Extract public ID from URL
        const urlParts = publicUrl.split('/');
        const folderAndFile = urlParts.slice(-2).join('/');
        const publicId = `easyshop/${folderAndFile.split('.')[0]}`;
        
        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result !== 'ok') {
            throw new Error('Failed to delete file from Cloudinary');
        }
        
        return result;
    } catch (error) {
        console.error('Cloudinary deletion error:', error);
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
