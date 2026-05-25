import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Streams an in-memory buffer straight to Cloudinary — no disk roundtrip.
const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve) => {
    if (!buffer) return resolve(null);
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', ...options },
      (err, result) => {
        if (err) {
          logger.error({ err }, 'Cloudinary upload failed');
          return resolve(null);
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });

export { uploadBufferToCloudinary };
