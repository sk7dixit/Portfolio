import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to store files in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Uploads a buffer to Cloudinary
 * @param fileBuffer The file buffer from multer memory storage
 * @param folder The target folder in Cloudinary
 * @param resourceType Optional resource type ('image' | 'raw' | 'video' | 'auto')
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  resourceType?: 'image' | 'raw' | 'video' | 'auto'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options: any = { folder };
    
    // Automatically default 'resumes' folder to 'raw' resource type to prevent PDF ACL access errors
    if (resourceType) {
      options.resource_type = resourceType;
    } else if (folder === 'resumes') {
      options.resource_type = 'raw';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload result is undefined'));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
