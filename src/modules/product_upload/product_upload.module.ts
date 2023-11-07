import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductUploadController} from './product_upload.controller';
import {ProductUpload} from './product_upload.entity';
import {ProductUploadService} from './product_upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUpload])],
  controllers: [ProductUploadController],
  providers: [ProductUploadService],
  exports: [ProductUploadService],
})
export class ProductUploadModule {}
