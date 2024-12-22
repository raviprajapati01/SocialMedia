import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

  // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadCloudinary = async (localPath) => {
    try {
        // console.log("Attempting upload with path:", localPath);
        const uploadResult = await cloudinary.uploader.upload(localPath, {
            resource_type: 'auto',
        });
        // console.log("Upload successful:", uploadResult);
        fs.unlinkSync(localPath);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localPath) // delet the local file while cloudinary uploaded failed
        throw new Error("Failed to upload file to Cloudinary.");
    }
    
}

export {uploadCloudinary}

