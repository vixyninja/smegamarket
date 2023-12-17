import { QueryOptions } from '@/core';
import { CreateProductInformationDTO } from '../dto';

export interface IProductInformationService {
  // ! CORE METHODS
  findOne(productInformationId: string): Promise<any>;

  // ! READ
  readOne(productInformationId: string): Promise<any>;
  readByName(name: string, query: QueryOptions): Promise<any>;
  readByType(type: string, query: QueryOptions): Promise<any>;
  readByStatus(status: string, query: QueryOptions): Promise<any>;
  readBySize(size: string, query: QueryOptions): Promise<any>;
  readBySale(sale: string, query: QueryOptions): Promise<any>;

  // ! CREATE
  createProductInformation(productInformationId: string, arg: CreateProductInformationDTO, media: Express.Multer.File[]): Promise<any>;

  // ! UPDATE
  updateProductInformation(productInformationId: string, arg: any): Promise<any>;
  updateProductInformationMedia(productInformationId: string, media: Express.Multer.File[]): Promise<any>;

  // ! DELETE
  deleteProductInformation(productInformationId: string): Promise<any>;
}
