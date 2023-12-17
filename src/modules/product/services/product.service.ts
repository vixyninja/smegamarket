import {HttpBadRequest, HttpInternalServerError, HttpNotFound} from '@/core';
import {Meta, QueryOptions} from '@/core/interface';
import {BrandEntity, BrandService} from '@/modules/brand';
import {CategoryEntity, CategoryService} from '@/modules/category';
import {MediaEntity, MediaService} from '@/modules/media';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {CreateProductDTO, UpdateProductDTO} from '../dto';
import {ProductEntity, ProductInformationEntity} from '../entities';
import {IProductService} from '../interfaces';

@Injectable()
export class ProductService implements IProductService {
  private queryBuilder: SelectQueryBuilder<ProductEntity>;

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
  ) {
    this.queryBuilder = this.productRepository.createQueryBuilder('product');
  }

  async findOne(productId: string): Promise<any> {
    try {
      const product = await this.queryBuilder.where({uuid: productId}).getOne();

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
        .leftJoin('product.categories', 'categories')
        .loadAllRelationIds({
          relations: ['brand', 'categories', 'media'],
        })
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
        .leftJoin('product.categories', 'categories')
        .loadAllRelationIds({
          relations: ['brand', 'categories', 'media'],
        })
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

  async createProduct(arg: CreateProductDTO, media: Express.Multer.File): Promise<any> {
    try {
      const {brandId, category, description, detail, link, name} = arg;

      var _brand: BrandEntity;
      var _category: string[];
      var _media: MediaEntity;
      var _detail: string[];
      var _description: string;
      var _link: string;
      var _name: string;

      if (brandId) {
        _brand = await this.brandService.findOne(brandId);
      }

      if (media) {
        _media = await this.mediaService.uploadFile(media);
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
          detail: _detail,
          brand: _brand,
          media: _media,
          productInformation: [],
          categories: [],
        })
        .execute();

      if (!product) {
        return new HttpBadRequest('Create product failed');
      }

      if (category) {
        _category = category instanceof Array ? category : [category];
        if (_category.length != 0) {
          await this.updateProductCategory(product.raw[0].uuid, _category);
        }
      }
      const response = await this.findOne(product.raw[0].uuid);

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

  async updateProductInformation(productId: string, productInformation: ProductInformationEntity): Promise<any> {
    try {
      const existProduct = await this.findOne(productId);

      if (!existProduct) {
        return new HttpNotFound('Product is not exist');
      }

      console.log(productInformation);

      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .where({uuid: productId})
        .update()
        .set({
          productInformation: [...existProduct.productInformation, productInformation],
        })
        .execute();

      if (!updateProduct) {
        return new HttpBadRequest('Update product failed');
      }

      const response = await this.findOne(productId);

      if (!response) {
        return new HttpNotFound('Product is not exist');
      }

      return response;
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

      var _category: string[];

      if (categoryId) {
        _category = categoryId instanceof Array ? categoryId : [categoryId];
      }

      const existCategory: CategoryEntity[] = await this.categoryService.findMany([...categoryId]);

      if (existCategory.length != 0) {
        await this.productRepository
          .createQueryBuilder('product')
          .where({uuid: productId})
          .relation(ProductEntity, 'categories')
          .of(productId)
          .add(_category);

        const response = await this.findOne(productId);

        if (!response) {
          return new HttpBadRequest('Update product failed');
        }

        return response;
      }
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateProductMedia(productId: string, file: Express.Multer.File): Promise<any> {
    try {
      const existProduct = await this.findOne(productId);

      if (!existProduct) {
        return new HttpNotFound('Product is not found');
      }

      const existMedia: MediaEntity = await this.mediaService.uploadFile(file);

      if (!existMedia) {
        return new HttpBadRequest('Upload media failed');
      }

      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .update()
        .set({media: existMedia})
        .where('product.uuid = :productId', {productId})
        .execute();

      if (!updateProduct) {
        return new HttpBadRequest('Update product failed');
      }

      const response = await this.findOne(productId);

      if (!response) {
        return new HttpNotFound('Product is not found');
      }

      return response;
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
