import {HttpBadRequest} from '@/core';
import {IQueryOptions, Meta} from '@/core/interface';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BrandEntity} from '../brand';
import {CategoryEntity} from '../category';
import {FileService} from '../file';
import {CreateProductDTO} from './dto';
import {UpdateProductDTO} from './dto/updateProduct.dto';
import {ProductEntity} from './product.entity';

interface ProductServiceInterface {
  findAll(query: IQueryOptions): Promise<any>;
  findOne(productId: string): Promise<any>;
  findAllByBrand(brandId: string, query: IQueryOptions): Promise<any>;
  findAllByCategory(categoryId: string, query: IQueryOptions): Promise<any>;
  create(createProductDTO: CreateProductDTO): Promise<any>;
  update(productId: string, updateProductDTO: UpdateProductDTO): Promise<any>;
  updateImage(productId: string, files: Express.Multer.File[]): Promise<any>;
  updateProductBrand(productId: string, brandId: string): Promise<any>;
  updateProductCategory(productId: string, categoryId: string): Promise<any>;
  delete(): Promise<any>;
}

@Injectable()
export class ProductService implements ProductServiceInterface {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly fileService: FileService,
  ) {}
  updateProductBrand(productId: string, brandId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateProductCategory(productId: string, categoryId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateBrand(productId: string, brandId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findAllByCategory(categoryId: string, query: IQueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findAllByBrand(brandId: string, query: IQueryOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async findAll(query: IQueryOptions): Promise<any> {
    try {
      let {_page, _limit, _order, _sort} = query;

      _page = _page ? Number(_page) : 1;
      _limit = _limit ? Number(_limit) : 10;
      _order = _order ? _order : 'DESC';
      _sort = _sort ? _sort : 'createdAt';

      const response = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brandId', 'brand')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.images', 'images')
        .skip((_page - 1) * _limit)
        .take(_limit)
        .orderBy(`product.${_sort}`, _order)
        .getMany();

      const total = await this.productRepository.count();

      return {
        meta: new Meta(
          _page,
          _limit,
          response.length,
          Math.ceil(total / _limit),
          query,
        ),
        data: response,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async findOne(productId: string): Promise<any> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          uuid: productId,
        },
      });

      if (!product) {
        return new HttpBadRequest('Product is not exist');
      }

      return {
        message: 'Get product success',
        data: product,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async create(createProductDTO: CreateProductDTO): Promise<any> {
    try {
      const isExist = await this.productRepository.findOne({
        where: {
          name: createProductDTO.name,
        },
      });

      if (isExist) {
        return new HttpBadRequest('Product is exist');
      }

      const brand = await this.brandRepository.findOne({
        where: {
          uuid: createProductDTO.brandId,
        },
      });

      if (!brand) {
        return new HttpBadRequest('Brand is not exist');
      }

      let categories: CategoryEntity[] = [];

      for (const categoryId of createProductDTO.category) {
        const categoryEntity = await this.categoryRepository.findOne({
          where: {
            uuid: categoryId,
          },
        });

        if (!categoryEntity) {
          return new HttpBadRequest('Category is not exist');
        }

        categories.push(categoryEntity);
      }

      const response = await this.productRepository.save({
        brandId: brand.uuid,
        category: categories,
        benefit: createProductDTO.benefit,
        caution: createProductDTO.caution,
        detail: createProductDTO.detail,
        link: createProductDTO.link,
        name: createProductDTO.name,
        price: createProductDTO.price,
        size: createProductDTO.size as any,
        status: createProductDTO.status as any,
        type: createProductDTO.type as any,
        sale: createProductDTO.sale as any,
      });

      if (!response) {
        return new HttpBadRequest('Create product failed');
      }

      return {
        message: 'Create product success',
        data: response,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async update(
    productId: string,
    updateProductDTO: UpdateProductDTO,
  ): Promise<any> {
    try {
      const isExist = await this.productRepository.findOne({
        where: {
          uuid: productId,
        },
      });

      if (!isExist) {
        return new HttpBadRequest('Product is not exist');
      }

      const mergeProduct = await this.productRepository
        .createQueryBuilder('product')
        .update(ProductEntity)
        .set({
          name: updateProductDTO.name ?? isExist.name,
          price: updateProductDTO.price ?? isExist.price,
          type: (updateProductDTO.type as any) ?? isExist.type,
          status: (updateProductDTO.status as any) ?? isExist.status,
          size: (updateProductDTO.size as any) ?? isExist.size,
          detail: updateProductDTO.detail ?? isExist.detail,
          benefit: updateProductDTO.benefit ?? isExist.benefit,
          caution: updateProductDTO.caution ?? isExist.caution,
          sale: (updateProductDTO.sale as any) ?? isExist.sale,
          link: updateProductDTO.link ?? isExist.link,
        })
        .where('uuid = :uuid', {uuid: productId})
        .execute();

      if (!mergeProduct) {
        return new HttpBadRequest('Update product failed');
      }

      const result = await this.productRepository.findOne({
        where: {uuid: productId},
      });

      return {
        message: 'Update product success',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async updateImage(
    productId: string,
    files: Express.Multer.File[],
  ): Promise<any> {
    try {
      const isExist = await this.productRepository.findOne({
        where: {uuid: productId},
      });

      if (!isExist) {
        return new HttpBadRequest('Product is not exist');
      }

      const file = await this.fileService.uploadFiles(files);

      if (!file) {
        return new HttpBadRequest('Upload file failed');
      }

      const mergeProduct = this.productRepository.merge(isExist, {
        images: file,
      });

      if (!mergeProduct) {
        return new HttpBadRequest('Update product failed');
      }
      const response = await this.productRepository.save(mergeProduct);

      if (!response) {
        return new HttpBadRequest('Update product failed');
      }

      const result = await this.productRepository.findOne({
        where: {uuid: productId},
      });

      return {
        message: 'Update product success',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async delete(): Promise<any> {
    try {
      const response = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .execute();

      if (!response) {
        return new HttpBadRequest('Delete product failed');
      }

      return {
        message: 'Delete product success',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
