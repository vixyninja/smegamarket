import {HttpBadRequest, HttpInternalServerError, HttpNotFound, QueryOptions} from '@/core';
import {MediaEntity, MediaService} from '@/modules/media';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateProductInformationDTO} from '../dto';
import {ProductInformationEntity} from '../entities';
import {ProductSaleEnum, ProductSizeEnum, ProductStatusEnum, ProductTypeEnum} from '../enum';
import {IProductInformationService} from '../interfaces';
import {ProductService} from './product.service';
@Injectable()
export class ProductInformationService implements IProductInformationService {
  constructor(
    @InjectRepository(ProductInformationEntity)
    private readonly productInformationRepository: Repository<ProductInformationEntity>,
    private readonly productService: ProductService,
    private readonly mediaService: MediaService,
  ) {}

  async findOne(productInformationId: string): Promise<any> {
    try {
      const productInformation = await this.productInformationRepository
        .createQueryBuilder('productInformation')
        .where('productInformation.id = :productInformationId', {
          productInformationId,
        })
        .getOne();

      return productInformation;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
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
  async createProductInformation(
    productId: string,
    arg: CreateProductInformationDTO,
    media: Express.Multer.File[],
  ): Promise<any> {
    try {
      const {description, link, price, sale, size, status, type} = arg;

      const existProduct = await this.productService.findOne(productId);

      var _description: string = '';
      var _link: string = '';
      var _price: number = 0;
      var _sale: ProductSaleEnum = ProductSaleEnum.None;
      var _size: ProductSizeEnum = ProductSizeEnum.None;
      var _status: ProductStatusEnum = ProductStatusEnum.Inactive;
      var _type: ProductTypeEnum = ProductTypeEnum.Etc;
      var _media: MediaEntity[] = [];

      if (description) {
        _description = description;
      }

      if (link) {
        _link = link;
      }

      if (price) {
        _price = price;
      }

      if (sale) {
      }

      if (size) {
      }

      if (status) {
      }

      if (type) {
      }

      if (media.length !== 0) {
        _media = await this.mediaService.uploadFiles(media);

        if (_media.length === 0) {
          return new HttpBadRequest('Upload media failed');
        }
      }

      const productInformation = await this.productInformationRepository
        .createQueryBuilder('productInformation')
        .insert()
        .into(ProductInformationEntity)
        .values({
          description: _description,
          link: _link,
          price: _price,
          sale: _sale,
          size: _size,
          status: _status,
          type: _type,
          media: _media,
        })
        .execute();

      if (!productInformation) {
        return new HttpBadRequest('Create product information failed');
      }

      const response: ProductInformationEntity = await this.findOne(productInformation.identifiers[0].id);

      if (!response) {
        return new HttpNotFound('Product information not found');
      }

      const insertProductInformationToProduct = await this.productService.updateProductInformation(
        existProduct.id,
        response,
      );

      if (!insertProductInformationToProduct) {
        return new HttpBadRequest('Insert product information to product failed');
      }

      return response;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  updateProductInformation(productInformationId: string, arg: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async updateProductInformationMedia(productInformationId: string, files: Express.Multer.File[]): Promise<any> {
    try {
      const existProductInformation = await this.findOne(productInformationId);

      if (!existProductInformation) {
        return new HttpNotFound('Product information not found');
      }

      const media: MediaEntity[] = await this.mediaService.uploadFiles(files);

      if (!media) {
        return new HttpBadRequest('Upload media failed');
      }

      const updateProductInformation = await this.productInformationRepository
        .createQueryBuilder('productInformation')
        .update()
        .set({
          media: media,
        })
        .where('productInformation.id = :productInformationId', {productInformationId})
        .execute();

      if (!updateProductInformation) {
        return new HttpBadRequest('Update product information failed');
      }

      const response = await this.findOne(productInformationId);

      if (!response) {
        return new HttpNotFound('Product information not found');
      }

      return response;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
  deleteProductInformation(productInformationId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
