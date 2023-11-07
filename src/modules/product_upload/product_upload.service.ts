import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductUpload} from './product_upload.entity';
import {Repository} from 'typeorm';

interface ProductUploadServiceInterface {
  read(): Promise<any>;
  readUploadByProductId(uuid: string): Promise<any>;
  create(): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}

@Injectable()
export class ProductUploadService implements ProductUploadServiceInterface {
  constructor(
    @InjectRepository(ProductUpload)
    private readonly productUploadRepository: Repository<ProductUpload>,
  ) {}
  readUploadByProductId(uuid: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  read(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  create(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
