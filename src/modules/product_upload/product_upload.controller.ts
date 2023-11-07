import { Controller } from '@nestjs/common';
import { ProductUploadService } from './product_upload.service';

@Controller('product-upload')
export class ProductUploadController {
  constructor(private readonly productUploadService: ProductUploadService) {}
}
