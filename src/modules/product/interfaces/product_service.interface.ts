import {QueryOptions} from 'mongoose';
import {CreateProductDTO, UpdateProductDTO} from '../dto';
import {ProductInformationEntity} from '../entities';

export interface IProductService {
  // ! CORE METHODS
  findAll(query: QueryOptions): Promise<any>;
  findOne(productId: string): Promise<any>;

  // ! READ
  readOne(productId: string): Promise<any>;
  readByName(name: string, query: QueryOptions): Promise<any>;
  readByBrand(brandId: string, query: QueryOptions): Promise<any>;
  readByCategory(categoryId: string, query: QueryOptions): Promise<any>;

  // ! CREATE
  createProduct(arg: CreateProductDTO, file: Express.Multer.File): Promise<any>;

  // ! UPDATE
  updateProduct(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any>;
  updateProductInformation(productId: string, productInformation: ProductInformationEntity): Promise<any>;
  updateProductCategory(productId: string, categoryId: string[]): Promise<any>;
  updateProductMedia(productId: string, file: Express.Multer.File): Promise<any>;
  updateProductBrand(productId: string, brandId: string): Promise<any>;

  // ! DELETE
  deleteProduct(productId: string): Promise<any>;
}
