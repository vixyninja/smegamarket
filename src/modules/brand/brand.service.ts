import {HttpBadRequest} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileService} from '../file';
import {BrandEntity} from './brand.entity';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';
import * as faker from '@faker-js/faker';

interface BrandServiceInterface {
  findAll(): Promise<any>;
  findOne(brandId: string): Promise<any>;
  create(createBrandDTO: CreateBrandDTO): Promise<any>;
  update(brandId: string, updateBrandDTO: UpdateBrandDTO): Promise<any>;
  updateImageId(brandId: string, image: Express.Multer.File): Promise<any>;
  delete(brandId: string): Promise<any>;
}

@Injectable()
export class BrandService implements BrandServiceInterface {
  constructor(
    @InjectRepository(BrandEntity) private readonly brandRepository: Repository<BrandEntity>,
    private readonly fileService: FileService,
  ) {}

  async import(): Promise<any> {
    try {
      faker.fakerVI.seed(124);

      const brands: BrandEntity[] = [];
      for (let i = 0; i < 8; i++) {
        const brand = new BrandEntity();
        brand.name = faker.fakerVI.commerce.department() + i;
        brand.imageId = '10e6c946-83d6-45ce-8051-87ce3f713a4d';
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

  async findAll(): Promise<any> {
    try {
      const brands = await this.brandRepository.find();
      return {
        message: 'Brands found successfully',
        data: brands,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async findOne(brandId: string): Promise<any> {
    try {
      const result = await this.brandRepository.findOne({where: {uuid: brandId}});
      if (!result) {
        return new HttpBadRequest('Brand not found');
      }
      return {
        message: 'Brand found successfully',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async create(createBrandDTO: CreateBrandDTO): Promise<any> {
    try {
      const brandExist = await this.brandRepository.findOne({where: {name: createBrandDTO.name}});
      if (brandExist) {
        return new HttpBadRequest('Brand already exist');
      }

      const brand = await this.brandRepository.save(createBrandDTO);

      if (!brand) {
        return new HttpBadRequest('Error creating brand');
      }

      return {
        message: 'Brand created successfully',
        data: brand,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async update(brandId: string, updateBrandDTO: UpdateBrandDTO): Promise<any> {
    try {
      const brand = await this.brandRepository.findOne({where: {uuid: brandId}});
      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const brandExist = await this.brandRepository.findOne({where: {name: updateBrandDTO.name}});
      if (brandExist) {
        return new HttpBadRequest('Brand already exist');
      }

      await this.brandRepository.update({uuid: brandId}, updateBrandDTO);
      return {
        message: 'Brand updated successfully',
        data: await this.brandRepository.findOne({where: {uuid: brandId}}),
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async updateImageId(brandId: string, image: Express.Multer.File): Promise<any> {
    try {
      const brand = await this.brandRepository.findOne({where: {uuid: brandId}});
      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      if (brand.imageId) {
        await this.fileService.deleteFile(brand.imageId);
      }

      const file = await this.fileService.uploadFile(image);
      if (!file) {
        return new HttpBadRequest('Error uploading image');
      }

      await this.brandRepository.update({uuid: brandId}, {imageId: file.uuid});

      return {
        message: 'Brand image updated successfully',
        data: await this.brandRepository.findOne({where: {uuid: brandId}}),
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async delete(brandId: string): Promise<any> {
    try {
      const brand = await this.brandRepository.findOne({where: {uuid: brandId}});
      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      await this.brandRepository.delete({uuid: brandId});
      return {
        message: 'Brand deleted successfully',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
