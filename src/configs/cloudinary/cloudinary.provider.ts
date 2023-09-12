import {Provider} from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary';
import {API_KEY, API_SECRET, CLOUD_NAME} from '../environments';

export const CloudinaryProvider: Provider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
  },
};
