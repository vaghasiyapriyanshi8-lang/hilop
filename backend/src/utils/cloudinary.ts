import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const uploadImage = async (filePath: string, folder = 'hilop') =>
  cloudinary.uploader.upload(filePath, { folder, resource_type: 'image' });
