import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Upload a Buffer (from multer memoryStorage) to Cloudinary
const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(new Error('Cloudinary upload failed'));
      resolve(result.secure_url);
    });
    Readable.from(buffer).pipe(stream);
  });
};

// Accepts either a Buffer (multipart upload) or a base64 string (legacy)
const uploadImage = async (input, folder = 'rentals') => {
  if (Buffer.isBuffer(input)) {
    return uploadBuffer(input, folder);
  }
  // Legacy base64 path
  try {
    const result = await cloudinary.uploader.upload(input, { folder });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed');
  }
};

export default uploadImage;
