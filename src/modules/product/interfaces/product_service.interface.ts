import {QueryOptions} from 'mongoose';
import {CreateProductDTO, UpdateProductDTO} from '../dto';

export interface IProductService {
  findAll(query: QueryOptions): Promise<any>;
  findOne(productId: string): Promise<any>;

  readOne(productId: string): Promise<any>;
  readByName(name: string, query: QueryOptions): Promise<any>;
  readByBrand(brandId: string, query: QueryOptions): Promise<any>;
  readByCategory(categoryId: string, query: QueryOptions): Promise<any>;
  createProduct(arg: CreateProductDTO, file: Express.Multer.File): Promise<any>;
  updateProduct(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any>;

  updateProductCategory(productId: string, categoryId: string[]): Promise<any>;
  updateProductMedia(productId: string, file: Express.Multer.File): Promise<any>;
  updateProductBrand(productId: string, brandId: string): Promise<any>;
  deleteProduct(productId: string): Promise<any>;
}
