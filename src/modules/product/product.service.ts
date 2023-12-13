import {HttpBadRequest, HttpInternalServerError, HttpNotFound} from '@/core';
import {Meta, QueryOptions} from '@/core/interface';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BrandEntity, BrandService} from '../brand';
import {CategoryEntity, CategoryService} from '../category';
import {MediaEntity, MediaService} from '../media';
import {CreateProductDTO, CreateProductInformationDTO, UpdateProductDTO, UpdateProductInformationDTO} from './dto';
import {ProductEntity, ProductInformationEntity, ProductMediaEntity} from './entities';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from './enum';

interface ProductServiceInterface {
  findAll(query: QueryOptions): Promise<any>;
  findOne(productId: string): Promise<any>;

  readOne(productId: string): Promise<any>;
  readByName(name: string, query: QueryOptions): Promise<any>;
  readByBrand(brandId: string, query: QueryOptions): Promise<any>;
  readByCategory(categoryId: string, query: QueryOptions): Promise<any>;
  createProduct(arg: CreateProductDTO, files: Express.Multer.File[]): Promise<any>;
  createProductInformation(
    productId: string,
    arg: CreateProductInformationDTO,
    files: Express.Multer.File[],
  ): Promise<any>;
  updateProduct(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any>;
  updateProductInformation(
    productId: string,
    productInformationId: string,
    arg: UpdateProductInformationDTO,
    files: Express.Multer.File[],
  ): Promise<any>;
  deleteProduct(productId: string): Promise<any>;
}

@Injectable()
export class ProductService implements ProductServiceInterface {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductInformationEntity)
    private readonly productInformationRepository: Repository<ProductInformationEntity>,
    @InjectRepository(ProductMediaEntity)
    private readonly productMediaRepository: Repository<ProductMediaEntity>,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
  ) {}

  async findOne(productId: string): Promise<any> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .where({uuid: productId})
        .getOne();

      return product;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findAll(query: QueryOptions): Promise<any> {
    try {
      let {_page, _limit, _sort, _order} = QueryOptions.initialize(query);

      const [products, count] = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`product.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: products,
        meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readByName(name: string, query: QueryOptions): Promise<any> {
    try {
      let {_page, _limit, _order, _sort} = QueryOptions.initialize(query);

      const [products, count] = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .where({name})
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`product.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: products,
        meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readByBrand(brandId: string, query: QueryOptions): Promise<any> {
    try {
      let {_page, _limit, _order, _sort} = QueryOptions.initialize(query);

      const [products, count] = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .where({brandId})
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`product.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: products,
        meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readByCategory(categoryId: string, query: QueryOptions): Promise<any> {
    try {
      let {_page, _limit, _order, _sort} = QueryOptions.initialize(query);

      const [products, count] = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .where({categoryId})
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`product.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: products,
        meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readAll(query: QueryOptions): Promise<any> {
    try {
      let {_page, _limit, _order, _sort} = QueryOptions.initialize(query);

      const [products, count] = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`product.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: products,
        meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async readOne(productId: string) {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .loadAllRelationIds()
        .where({uuid: productId})
        .getOne();

      if (!product) {
        return new HttpNotFound('Product is not exist');
      }

      return product;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async createProduct(arg: CreateProductDTO, files: Express.Multer.File[]): Promise<any> {
    try {
      const {brandId, description, link, name, category, detail} = arg;

      const existProduct = await this.productRepository.createQueryBuilder('product').where({name: name}).getOne();

      if (existProduct) {
        return new HttpNotFound('Product already exist');
      }

      var _name: string,
        _description: string,
        _link: string,
        _media: MediaEntity[],
        _detail: string[],
        _brand: BrandEntity,
        _category: CategoryEntity[];

      _name = name ?? 'No name';
      _link = link ?? 'No link';
      _description = description ?? 'No description';
      _detail = detail instanceof Array ? detail : [detail];

      // _brand = await this.brandService.findOne(brandId);

      if (!_brand) {
        return new HttpNotFound('Brand is not exist');
      }

      _category = await this.categoryService.findMany([...category]);

      if (!_category) {
        return new HttpNotFound('Category is not exist');
      }

      if (files.length != 0) {
        _media = await this.mediaService.uploadFiles(files);

        if (!_media) {
          return new HttpBadRequest('Upload file failed');
        }
      }

      const createProduct = await this.productRepository
        .createQueryBuilder('product')
        .insert()
        .into(ProductEntity)
        .values({
          name: _name,
          brand: _brand,
          description: _description,
          detail: _detail,
          link: _link,
          productInformation: [],
        })
        .execute();

      if (!createProduct) {
        return new HttpBadRequest('Create product failed');
      }

      _media &&
        (await this.productRepository
          .createQueryBuilder('product_media')
          .insert()
          .into('product_media')
          .values(_media.map((file) => ({productId: createProduct.raw[0].uuid, imageId: file.uuid})))
          .execute());

      _category &&
        (await this.productRepository
          .createQueryBuilder('product_category')
          .insert()
          .into('product_category')
          .values(_category.map((cate) => ({productId: createProduct.raw[0].uuid, categoryId: cate.uuid})))
          .execute());

      const response = await this.findOne(createProduct.raw[0].uuid);

      if (!response) {
        return new HttpBadRequest('Create product failed');
      }

      return response;
    } catch (e) {
      console.log(e);

      throw new HttpInternalServerError(e.message);
    }
  }

  async createProductInformation(
    productId: string,
    arg: CreateProductInformationDTO,
    files: Express.Multer.File[],
  ): Promise<any> {
    try {
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateProduct(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any> {
    try {
      const {brandId, description, link, name, category, detail} = arg;

      const existProduct = await this.productRepository.createQueryBuilder('product').where({name: name}).getOne();

      if (!existProduct) {
        return new HttpNotFound('Product is not exist');
      }

      var _name: string,
        _description: string,
        _link: string,
        _media: MediaEntity[],
        _detail: string[],
        _brand: BrandEntity,
        _category: CategoryEntity[];

      _name = name ?? 'No name';
      _link = link ?? '';
      _description = description ?? '';
      _detail = detail instanceof Array ? detail : [detail];

      _brand = await this.brandService.findOne(brandId);

      if (!_brand) {
        return new HttpNotFound('Brand is not exist');
      } else {
        existProduct.brand = _brand;
      }

      _category = await this.categoryService.findMany([...category]);

      if (!_category) {
        return new HttpNotFound('Category is not exist');
      }

      if (files.length != 0) {
        const temp = await this.mediaService.uploadFiles(files);

        if (!temp) {
          return new HttpBadRequest('Upload file failed');
        }

        _media = [...temp];

        if (!_media) {
          return new HttpBadRequest('Upload file failed');
        }
      }

      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .update()
        .set({
          name: _name,
          brand: _brand,
          description: _description,
          detail: _detail,
          link: _link,
        })
        .execute();

      if (!updateProduct) {
        return new HttpBadRequest('Update product failed');
      }

      if (_media) {
        await this.productRepository
          .createQueryBuilder('product_media')
          .delete()
          .where({productId: updateProduct.raw[0].uuid})
          .execute();

        await this.productRepository
          .createQueryBuilder('product_media')
          .insert()
          .into('product_media')
          .values(_media.map((file) => ({productId: updateProduct.raw[0].uuid, imageId: file.uuid})))
          .execute();
      }

      if (_category) {
        await this.productRepository
          .createQueryBuilder('product_category')
          .delete()
          .where({productId: updateProduct.raw[0].uuid})
          .execute();

        await this.productRepository
          .createQueryBuilder('product_category')
          .insert()
          .into('product_category')
          .values(_category.map((cate) => ({productId: updateProduct.raw[0].uuid, categoryId: cate.uuid})))
          .execute();
      }

      const response = await this.findOne(updateProduct.raw[0].uuid);

      if (!response) {
        return new HttpBadRequest('Update product failed');
      }

      return response;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateProductInformation(
    productId: string,
    productInformationId: string,
    arg: UpdateProductInformationDTO,
    files: Express.Multer.File[],
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async deleteProduct(productId: string): Promise<any> {
    try {
      const response = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where({uuid: productId})
        .execute();

      if (!response) {
        return new HttpBadRequest('Delete product failed');
      }

      return 'Delete product success';
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
