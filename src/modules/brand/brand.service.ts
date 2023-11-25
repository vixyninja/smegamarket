import {HttpBadRequest, HttpForbidden, HttpInternalServerError} from '@/core';
import {IQueryOptions, Meta} from '@/core/interface';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileService} from '../file';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';
import {BrandEntity} from './entities';

interface BrandServiceInterface {
  findAll(query: IQueryOptions): Promise<any>;
  findOne(brandId: string): Promise<any>;
  create(arg: CreateBrandDTO, file: Express.Multer.File): Promise<any>;
  update(brandId: string, arg: UpdateBrandDTO): Promise<any>;
  updateImage(brandId: string, file: Express.Multer.File): Promise<any>;
  delete(brandId: string): Promise<any>;
}

@Injectable()
export class BrandService implements BrandServiceInterface {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    private readonly fileService: FileService,
  ) {}

  async findAll(query: IQueryOptions): Promise<any> {
    try {
      let {_limit, _order, _page, _sort} = query;

      _page = _page ? Number(_page) : 1;
      _limit = _limit ? Number(_limit) : 10;
      _sort = _sort ? _sort : 'createdAt';
      _order = _order ? _order : 'DESC';

      const [brands, count] = await this.brandRepository
        .createQueryBuilder('brand')
        .loadAllRelationIds()
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`brand.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: brands,
        meta: new Meta(_page, _limit, brands.length, Math.ceil(count / _limit), query),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findOne(brandId: string): Promise<any> {
    try {
      const brand = await this.brandRepository.createQueryBuilder('brand').where({uuid: brandId}).getOne();

      if (!brand) {
        return new HttpForbidden('Brand not found');
      }

      return brand;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async create(arg: CreateBrandDTO, file: Express.Multer.File): Promise<any> {
    try {
      const {address, description, email, name, phoneNumber, website} = arg;

      const brandExist = await this.brandRepository.createQueryBuilder('brand').where({name: name}).getOne();

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
        .values({
          address: address,
          description: description,
          email: email,
          name: name,
          phoneNumber: phoneNumber,
          website: website,
          avatar: avatarUpload,
        })
        .execute();

      if (!brand) {
        return new HttpBadRequest('Error creating brand');
      }

      const result = await this.findOne(brand.raw.insertId);

      if (!result) {
        return new HttpBadRequest('Error creating brand');
      }

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async update(brandId: string, arg: UpdateBrandDTO): Promise<any> {
    try {
      const {address, description, email, name, phoneNumber, website} = arg;

      const brand = await this.brandRepository.createQueryBuilder('brand').where({uuid: brandId}).getOne();

      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const brandExistValue = await this.brandRepository
        .createQueryBuilder('brand')
        .where({name: name})
        .orWhere({email: email})
        .orWhere({phoneNumber: phoneNumber})
        .orWhere({website: website})
        .getOne();

      if (brandExistValue) {
        return new HttpBadRequest("Brand's value already exist");
      }

      const updatedBrand = await this.brandRepository
        .createQueryBuilder('brand')
        .update()
        .set({
          address: address ?? brand.address,
          description: description ?? brand.description,
          email: email ?? brand.email,
          name: name ?? brand.name,
          phoneNumber: phoneNumber ?? brand.phoneNumber,
          website: website ?? brand.website,
        })
        .where({uuid: brandId})
        .execute();

      if (!updatedBrand) {
        return new HttpBadRequest('Error updating brand');
      }

      const result = await this.findOne(brandId);

      if (!result) {
        return new HttpBadRequest('Error updating brand');
      }

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateImage(brandId: string, image: Express.Multer.File): Promise<any> {
    try {
      const brand = await this.brandRepository.createQueryBuilder('brand').where({uuid: brandId}).getOne();

      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const file = await this.fileService.uploadFile(image);

      if (!file) {
        return new HttpBadRequest('Error uploading image');
      }

      const updatedBrand = await this.brandRepository
        .createQueryBuilder('brand')
        .update()
        .set({avatar: file})
        .where({uuid: brandId})
        .execute();

      if (!updatedBrand) {
        return new HttpBadRequest('Error updating brand');
      }

      const result = await this.findOne(brandId);

      if (!result) {
        return new HttpBadRequest('Error updating brand');
      }

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async delete(brandId: string): Promise<any> {
    try {
      const response = await this.brandRepository.createQueryBuilder('brand').delete().where({uuid: brandId}).execute();

      if (!response) {
        return new HttpBadRequest('Error deleting brand');
      }

      return 'Brand deleted successfully';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
