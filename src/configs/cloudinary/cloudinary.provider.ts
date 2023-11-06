import {Provider} from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary';
import {Environment} from '../environments';

export const CloudinaryProvider: Provider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: Environment.CLOUD_NAME,
      api_key: Environment.API_KEY,
      api_secret: Environment.API_SECRET,
      secure: true,
    });
  },
};
