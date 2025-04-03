import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_API_Key,
  api_secret: process.env.cloudinary_API_Secret,
});

export default cloudinary;