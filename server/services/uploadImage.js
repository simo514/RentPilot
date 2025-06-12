import cloudinary from '../config/cloudinary.js';

const uploadImage = async (base64, folder = 'rentals') => {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder,
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed');
  }
};

export default uploadImage;
