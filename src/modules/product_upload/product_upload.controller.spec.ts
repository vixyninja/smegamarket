import { Test, TestingModule } from '@nestjs/testing';
import { ProductUploadController } from './product_upload.controller';
import { ProductUploadService } from './product_upload.service';

describe('ProductUploadController', () => {
  let controller: ProductUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductUploadController],
      providers: [ProductUploadService],
    }).compile();

    controller = module.get<ProductUploadController>(ProductUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
