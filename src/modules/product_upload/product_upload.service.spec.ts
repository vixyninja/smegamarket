import { Test, TestingModule } from '@nestjs/testing';
import { ProductUploadService } from './product_upload.service';

describe('ProductUploadService', () => {
  let service: ProductUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUploadService],
    }).compile();

    service = module.get<ProductUploadService>(ProductUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
