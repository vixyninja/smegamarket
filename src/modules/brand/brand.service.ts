import {HttpBadRequest} from '@/core';
import {IQueryOptions, Meta} from '@/core/interface';
import * as faker from '@faker-js/faker';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileService} from '../file';
import {BrandEntity} from './brand.entity';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';

interface BrandServiceInterface {
  findAll(query: IQueryOptions): Promise<any>;
  findOne(brandId: string): Promise<any>;
  create(
    createBrandDTO: CreateBrandDTO,
    file: Express.Multer.File,
  ): Promise<any>;
  update(brandId: string, updateBrandDTO: UpdateBrandDTO): Promise<any>;
  updateImage(brandId: string, image: Express.Multer.File): Promise<any>;
  delete(brandId: string): Promise<any>;
}

@Injectable()
export class BrandService implements BrandServiceInterface {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    private readonly fileService: FileService,
  ) {}

  async import(): Promise<any> {
    try {
      faker.fakerVI.seed(124);

      const brands: BrandEntity[] = [];
      for (let i = 0; i < 8; i++) {
        const brand = new BrandEntity();
        brand.name = faker.fakerVI.commerce.department() + i;
        brand.description = faker.fakerVI.lorem.paragraph();
        brand.address = faker.fakerVI.location.streetAddress();
        brand.phoneNumber = faker.fakerVI.phone.number();
        brand.email = faker.fakerVI.internet.email();
        brand.website = faker.fakerVI.internet.url();
        brands.push(brand);
      }
      await this.brandRepository.save(brands);
      return {
        message: 'Brands imported successfully',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async findAll(query: IQueryOptions): Promise<any> {
    try {
      let {_limit, _order, _page, _sort} = query;

      _page = _page ? Number(_page) : 1;
      _limit = _limit ? Number(_limit) : 10;
      _sort = _sort ? _sort : 'createdAt';
      _order = _order ? _order : 'DESC';

      const brands = await this.brandRepository
        .createQueryBuilder('brand')
        .leftJoinAndSelect('brand.avatar', 'avatar')
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`brand.${_sort}`, _order)
        .getMany();

      const total = await this.brandRepository.count();

      return {
        message: 'Brands found successfully',
        data: brands,
        meta: new Meta(
          _page,
          _limit,
          brands.length,
          Math.ceil(total / _limit),
          query,
        ),
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async findOne(brandId: string): Promise<any> {
    try {
      const brand = await this.brandRepository.findOne({
        where: {uuid: brandId},
      });
      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }
      return {
        message: 'Brand found successfully',
        data: brand,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async create(
    createBrandDTO: CreateBrandDTO,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const brandExist = await this.brandRepository.findOne({
        where: {name: createBrandDTO.name},
      });

      if (brandExist) {
        return new HttpBadRequest('Brand already exist');
      }

      const avatarUpload = await this.fileService.uploadFile(file);

      if (!avatarUpload) {
        return new HttpBadRequest('Error uploading image');
      }

      const brand = await this.brandRepository
        .createQueryBuilder('brand')
        .insert()
        .into(BrandEntity)
        .values({...createBrandDTO, avatar: avatarUpload})
        .execute();

      if (!brand) {
        return new HttpBadRequest('Error creating brand');
      }

      const result = await this.brandRepository.findOne({
        where: {uuid: brand.raw.insertId},
      });

      return {
        message: 'Brand created successfully',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async update(brandId: string, updateBrandDTO: UpdateBrandDTO): Promise<any> {
    try {
      const brand = await this.brandRepository.findOne({
        where: {uuid: brandId},
      });
      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const brandExist = await this.brandRepository.findOne({
        where: {name: updateBrandDTO.name},
      });
      if (brandExist) {
        return new HttpBadRequest('Brand already exist');
      }

      const updatedBrand = await this.brandRepository
        .createQueryBuilder('brand')
        .update()
        .set(updateBrandDTO)
        .where({uuid: brandId})
        .execute();

      if (!updatedBrand) {
        return new HttpBadRequest('Error updating brand');
      }

      const result = await this.brandRepository.findOne({
        where: {uuid: brandId},
      });

      return {
        message: 'Brand updated successfully',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async updateImage(brandId: string, image: Express.Multer.File): Promise<any> {
    try {
      const brand = await this.brandRepository.findOne({
        where: {uuid: brandId},
      });

      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const file = await this.fileService.uploadFile(image);
      if (!file) {
        return new HttpBadRequest('Error uploading image');
      }

      const updatedBrand = await this.brandRepository.update(
        {uuid: brandId},
        {avatar: file},
      );

      if (!updatedBrand) {
        return new HttpBadRequest('Error updating brand');
      }

      const result = await this.brandRepository.findOne({
        where: {uuid: brandId},
      });

      return {
        message: 'Brand image updated successfully',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async delete(brandId: string): Promise<any> {
    try {
      const response = await this.brandRepository
        .createQueryBuilder('brand')
        .delete()
        .where({uuid: brandId})
        .execute();

      if (!response) {
        return new HttpBadRequest('Error deleting brand');
      }

      return {
        message: 'Brand deleted successfully',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
