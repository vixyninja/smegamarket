import {HttpBadRequest, HttpInternalServerError, HttpNotFound} from '@/core';
import {Meta, QueryOptions} from '@/core/interface';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BrandEntity, BrandService} from '../brand';
import {CategoryEntity, CategoryService} from '../category';
import {MediaEntity, MediaService} from '../media';
import {CreateProductDTO, UpdateProductDTO} from './dto';
import {ProductEntity, ProductInformationEntity, ProductMediaEntity} from './entities';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from './enum';

interface ProductServiceInterface {
  findAll(query: QueryOptions): Promise<any>;
  findOne(productId: string): Promise<any>;
  readOne(productId: string): Promise<any>;
  readByBrand(brandId: string, query: QueryOptions): Promise<any>;
  readByCategory(categoryId: string, query: QueryOptions): Promise<any>;
  create(createProductDTO: CreateProductDTO, files: Express.Multer.File[]): Promise<any>;
  update(productId: string, updateProductDTO: UpdateProductDTO, files: Express.Multer.File[]): Promise<any>;
  delete(productId: string): Promise<any>;
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
        .orderBy(`product.${_sort}`, _order === 'DESC' ? 'DESC' : 'ASC')
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
        .orderBy(`product.${_sort}`, _order === 'DESC' ? 'DESC' : 'ASC')
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
        .orderBy(`product.${_sort}`, _order === 'DESC' ? 'DESC' : 'ASC')
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
        .orderBy(`product.${_sort}`, _order === 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount();

      return {
        data: products,
        meta: new Meta(_page, _limit, products.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async readOne(productId: string): Promise<any> {
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

  async create(arg: CreateProductDTO, files: Express.Multer.File[]): Promise<any> {
    try {
      const {brandId, description, link, name, price, category} = arg;

      var _name: string,
        _price: number,
        _description: string,
        _link: string,
        _media: MediaEntity[],
        _brand: BrandEntity,
        _category: CategoryEntity[];

      _name = name ?? 'No name';
      _price = price ?? 0;
      _link = link ?? '';
      _description = description ?? '';

      const existProduct = await this.productRepository.createQueryBuilder('product').where({name: name}).getOne();

      if (existProduct) {
        return new HttpNotFound('Product already exist');
      }

      _brand = await this.brandService.findOne(brandId);

      if (!_brand) {
        return new HttpNotFound('Brand is not exist');
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

      const createProduct = await this.productRepository
        .createQueryBuilder('product')
        .insert()
        .into(ProductEntity)
        .values({
          name: _name,
          brand: _brand,
          description: _description,
        })
        .execute();

      if (!createProduct) {
        return new HttpBadRequest('Create product failed');
      }

      if (_media) {
        await this.productRepository
          .createQueryBuilder('product_image')
          .insert()
          .into('product_image')
          .values(_media.map((file) => ({productId: createProduct.raw[0].uuid, imageId: file.uuid})))
          .execute();
      }

      if (_category) {
        await this.productRepository
          .createQueryBuilder('product_category')
          .insert()
          .into('product_category')
          .values(_category.map((cate) => ({productId: createProduct.raw[0].uuid, categoryId: cate.uuid})))
          .execute();
      }

      const response = await this.findOne(createProduct.raw[0].uuid);

      if (!response) {
        return new HttpBadRequest('Create product failed');
      }

      return response;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async update(productId: string, arg: UpdateProductDTO, files: Express.Multer.File[]): Promise<any> {
    try {
      const {benefit, brandId, category, caution, detail, link, name, price, sale, size, status, type} = arg;

      const product = await this.findOne(productId);

      if (!product) {
        return new HttpBadRequest('Product is not exist');
      }

      var _name: string,
        _price: number,
        _link: string,
        _type: ProductEnum,
        _status: StatusEnum,
        _size: SizeEnum,
        _sale: SaleEnum,
        _detail: string[],
        _benefit: string[],
        _caution: string[],
        _brand: BrandEntity,
        _files: MediaEntity[],
        _category: CategoryEntity[];

      _name = name ?? product.name;
      _price = price ?? product.price;
      _link = link ?? product.link;

      _type = ProductEnum[type] ?? ProductEnum[product.type] ?? ProductEnum['Etc'];
      _status = StatusEnum[status] ?? StatusEnum[product.status] ?? StatusEnum['Inactive'];
      _size = SizeEnum[size] ?? SizeEnum[product.size] ?? SizeEnum['None'];
      _sale = SaleEnum[sale] ?? SaleEnum[product.sale] ?? SaleEnum['None'];

      _detail = [detail] ?? product.detail ?? [];
      _benefit = [benefit] ?? product.benefit ?? [];
      _caution = [caution] ?? product.caution ?? [];

      if (brandId) {
        _brand = await this.brandService.findOne(brandId);
      } else {
        _brand = await this.brandService.findOne(product.brand);
      }

      if (!_brand) {
        return new HttpBadRequest('Brand is not exist');
      }

      if (category) {
        _category = await this.categoryService.findMany(category);
      } else {
        _category = await this.categoryService.findMany(product.categories);
      }

      if (!_category) {
        return new HttpBadRequest('Category is not exist');
      }

      if (files && files.length != 0) {
        const temp = await this.mediaService.uploadFiles(files);

        if (!temp) {
          return new HttpBadRequest('Upload file failed');
        }

        _files = [...temp];

        if (!_files) {
          return new HttpBadRequest('Upload file failed');
        }
      }

      if (_category) {
        const oldCategory = await this.productRepository
          .createQueryBuilder('product_category')
          .delete()
          .from('product_category')
          .where({productId: productId})
          .execute();

        if (!oldCategory) {
          return new HttpBadRequest('Update product failed');
        }

        await this.productRepository
          .createQueryBuilder('product_category')
          .insert()
          .into('product_category')
          .values(_category.map((cate) => ({productId: productId, categoryId: cate.uuid})))
          .execute();
      }

      if (_files && _files.length != 0) {
        const oldImage = await this.productRepository
          .createQueryBuilder('product_image')
          .delete()
          .from('product_image')
          .where({productId: productId})
          .execute();

        if (!oldImage) {
          return new HttpBadRequest('Update product failed');
        }

        await this.productRepository
          .createQueryBuilder('product_image')
          .insert()
          .into('product_image')
          .values(_files.map((file) => ({productId: productId, imageId: file.uuid})))
          .execute();
      }

      console.log('Name', _name);
      console.log('Price', _price);
      console.log('Type', _type);
      console.log('Status', _status);
      console.log('Size', _size);
      console.log('Detail', _detail);
      console.log('Benefit', _benefit);
      console.log('Caution', _caution);
      console.log('Sale', _sale);
      console.log('Link', _link);

      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .update(ProductEntity)
        .set({
          name: _name,
          price: _price,
          type: _type,
          status: _status,
          size: _size,
          detail: _detail,
          benefit: _benefit,
          caution: _caution,
          sale: _sale,
          link: _link,
          brand: _brand,
        })
        .where({uuid: productId})
        .execute();

      if (!updateProduct) {
        return new HttpBadRequest('Update product failed');
      }

      const response = await this.findOne(productId);

      if (!response) {
        return new HttpBadRequest('Update product failed');
      }

      return response;
    } catch (e) {
      console.log(e);

      throw new HttpInternalServerError(e.message);
    }
  }

  async delete(productId: string): Promise<any> {
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
