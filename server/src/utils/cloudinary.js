import { v2 as cloudinary } from 'cloudinary';
import {fs} from 'fs'

  // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


//

const uploadCloudinary = async (localPath) =>{
    try {
        if(!localPath) return null
        //upload the file on cloudinary
        const uploadResult = await cloudinary.uploader.upload(localPath, {
            resource_type: 'auto',
        })

        //file has been uploaded successfully
        console.log("file is uploded on cloudinaary", uploadResult.url);
        return uploadResult;

    } catch (error) {
        fs.unlinkSync(localPath) // remove the locally saved temperary file when file uploaded failed
        return null;
    }
}

export {uploadCloudinary}

