import {HttpBadRequest, HttpInternalServerError, HttpNotFound} from '@/core';
import {Meta, QueryOptions} from '@/core/interface';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BrandEntity, BrandService} from '../brand';
import {CategoryEntity, CategoryService} from '../category';
import {MediaEntity, MediaService} from '../media';
import {CreateProductDTO, UpdateProductDTO} from './dto';
import {ProductEntity} from './entities';

interface ProductServiceInterface {
  findAll(query: QueryOptions): Promise<any>;
  findOne(productId: string): Promise<any>;

  readOne(productId: string): Promise<any>;
  readByName(name: string, query: QueryOptions): Promise<any>;
  readByBrand(brandId: string, query: QueryOptions): Promise<any>;
  readByCategory(categoryId: string, query: QueryOptions): Promise<any>;
  createProduct(arg: CreateProductDTO, files: Express.Multer.File[]): Promise<any>;
  updateProduct(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any>;

  updateProductCategory(productId: string, categoryId: string[]): Promise<any>;
  updateProductMedia(productId: string, mediaId: Express.Multer.File[]): Promise<any>;
  updateProductBrand(productId: string, brandId: string): Promise<any>;
  deleteProduct(productId: string): Promise<any>;
}

@Injectable()
export class ProductService implements ProductServiceInterface {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
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

      // const [products, count] = await this.productRepository
      //   .createQueryBuilder('product')
      //   .loadAllRelationIds()
      //   .skip(_limit * (_page - 1))
      //   .take(_limit)
      //   .orderBy(`product.${_sort}`, _order)
      //   .getManyAndCount();

      const test = await this.productRepository.createQueryBuilder('product').loadAllRelationIds().getMany();

      return {
        data: test,
      };
      // return {
      //   data: products,
      //   meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      // };
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
      const {brandId, category, description, detail, link, name} = arg;

      var _brand: BrandEntity;
      var _category: CategoryEntity[];
      var _media: MediaEntity[];
      var _detail: string[];
      var _description: string;
      var _link: string;
      var _name: string;

      if (brandId) {
        _brand = await this.brandService.findOne(brandId);
      }

      if (files) {
        _media = await this.mediaService.uploadFiles([...files]);
      }

      if (detail) {
        _detail = detail instanceof Array ? detail : [detail];
      }

      if (description) {
        _description = description.trim();
      }

      if (link) {
        _link = link.trim();
      }

      if (name) {
        _name = name.trim();
      }

      const product = await this.productRepository
        .createQueryBuilder('product')
        .insert()
        .into(ProductEntity)
        .values({
          name: _name,
          description: _description,
          link: _link,
          productInformation: [],
          detail: [],
          brand: null,
          categories: [],
        })
        .execute();

      if (!product) {
        return new HttpBadRequest('Create product failed');
      }

      if (category) {
        _category = await this.categoryService.findMany([...category]);

        await this.productRepository
          .createQueryBuilder('product_category')
          .relation(ProductEntity, 'categories')
          .of(product.raw[0].uuid)
          .add(_category);
      }

      const response = await this.productRepository
        .createQueryBuilder('product')
        .where({uuid: product.raw[0].uuid})
        .getOne();

      console.log(response);

      if (!response) {
        return new HttpBadRequest('Create product failed');
      }

      return response;
    } catch (e) {
      console.log(e);

      throw new HttpInternalServerError(e.message);
    }
  }

  async updateProduct(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any> {
    try {
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateProductBrand(productId: string, brandId: string): Promise<any> {
    try {
      const existProduct = await this.findOne(productId);

      if (!existProduct) {
        return new HttpNotFound('Product is not exist');
      }

      const existBrand = await this.brandService.findOne(brandId);

      if (!existBrand) {
        return new HttpNotFound('Brand is not exist');
      }

      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .where({uuid: productId})
        .update()
        .set({brand: existBrand})
        .execute();

      if (!updateProduct) {
        return new HttpBadRequest('Update product failed');
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

  async updateProductCategory(productId: string, categoryId: string[]): Promise<any> {
    try {
      const existProduct = await this.findOne(productId);

      if (!existProduct) {
        return new HttpNotFound('Product is not exist');
      }

      const existCategory: CategoryEntity[] = await this.categoryService.findMany([...categoryId]);

      if (existCategory.length != 0) {
        const updateProduct = await this.productRepository
          .createQueryBuilder('product')
          .where({uuid: productId})
          .update()
          .set({categories: existCategory})
          .execute();

        if (!updateProduct) {
          return new HttpBadRequest('Update product failed');
        }

        const response = await this.findOne(updateProduct.raw[0].uuid);

        if (!response) {
          return new HttpBadRequest('Update product failed');
        }

        return response;
      }
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateProductMedia(productId: string, mediaId: Express.Multer.File[]): Promise<any> {
    try {
      const existProduct = await this.findOne(productId);

      if (!existProduct) {
        return new HttpNotFound('Product is not exist');
      }

      const existMedia: MediaEntity[] = await this.mediaService.uploadFiles([...mediaId]);

      if (existMedia.length != 0) {
        const updateProduct = await this.productRepository
          .createQueryBuilder('product')
          .where({uuid: productId})
          .update()
          .set({productInformation: existMedia})
          .execute();

        if (!updateProduct) {
          return new HttpBadRequest('Update product failed');
        }

        const response = await this.findOne(updateProduct.raw[0].uuid);

        if (!response) {
          return new HttpBadRequest('Update product failed');
        }

        return response;
      }
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteProduct(productId: string): Promise<any> {
    try {
      const response = await this.productRepository
        .createQueryBuilder('product')
        .where({uuid: productId})
        .delete()
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
