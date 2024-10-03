import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';


async function uploadCloudinary(fileBuffer) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'UMS' },
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    return reject(new Error('Failed to upload image'));
                }
                resolve(result.secure_url);
            }
        );

       
        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null); 
        bufferStream.pipe(stream);
    });
}

export default uploadCloudinary;
