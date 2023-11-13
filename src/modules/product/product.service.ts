import {Injectable} from '@nestjs/common';

interface ProductServiceInterface {
  findAll(): Promise<any>;
  findOne(productId: string): Promise<any>;
  create(): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}

@Injectable()
export class ProductService {}
