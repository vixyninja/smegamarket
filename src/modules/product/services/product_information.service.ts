import {Injectable} from '@nestjs/common';
import {IProductInformationService} from '../interfaces';
import {QueryOptions} from '@/core';

@Injectable()
export class ProductInformationService implements IProductInformationService {
  findOne(productInformationId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  readOne(productInformationId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  readByName(name: string, query: QueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }
  readByType(type: string, query: QueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }
  readByStatus(status: string, query: QueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }
  readBySize(size: string, query: QueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }
  readBySale(sale: string, query: QueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createProductInformation(arg: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateProductInformation(productInformationId: string, arg: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateProductInformationMedia(productInformationId: string, files: Express.Multer.File[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteProductInformation(productInformationId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
