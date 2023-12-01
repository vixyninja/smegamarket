import {CACHE_KEY, HttpBadRequest, HttpForbidden, HttpInternalServerError} from '@/core';
import {Meta, QueryOptions} from '@/core/interface';
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MediaEntity, MediaService} from '../media';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';
import {BrandEntity} from './entities';
import {RedisxService} from '@/configs';

interface BrandServiceInterface {
  findOne(brandId: string): Promise<any>;
  findByName(name: string): Promise<any>;
  create(arg: CreateBrandDTO, file: Express.Multer.File): Promise<any>;
  query(query: QueryOptions): Promise<any>;
  readOne(brandId: string): Promise<any>;
  readAll(): Promise<any>;
  update(brandId: string, arg: UpdateBrandDTO, file: Express.Multer.File): Promise<any>;
  delete(brandId: string): Promise<any>;
  deleteImage(brandId: string): Promise<any>;
}

@Injectable()
export class BrandService implements BrandServiceInterface {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    private readonly mediaService: MediaService,
    private readonly redisxService: RedisxService,
  ) {}

  async findOne(brandId: string): Promise<any> {
    try {
      const brand = await this.brandRepository
        .createQueryBuilder('brand')
        .loadAllRelationIds()
        .where({uuid: brandId})
        .getOne();

      return brand;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findByName(name: string): Promise<any> {
    try {
      const brand = await this.brandRepository
        .createQueryBuilder('brand')
        .loadAllRelationIds()
        .where('LOWER(brand.name) LIKE LOWER(:name)', {name: `%${name}%`})
        .getMany();

      Logger.log(brand);

      return brand;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async create(arg: CreateBrandDTO, file: Express.Multer.File): Promise<any> {
    try {
      const {address, description, email, name, phone, website} = arg;

      var _address: string, _description: string, _email: string, _name: string, _phone: string, _website: string;
      var _file: MediaEntity;

      const brandExist = await this.brandRepository
        .createQueryBuilder('brand')
        .where({name: name})
        .orWhere({email: email})
        .orWhere({phone: phone})
        .orWhere({website: website})
        .getOne();

      if (brandExist) {
        return new HttpBadRequest('Brand already exist');
      }

      if (file) {
        const avatarUpload = await this.mediaService.uploadFile(file);
        if (!avatarUpload) {
          return new HttpBadRequest('Error uploading image');
        }
        _file = avatarUpload;
      } else {
        _file = null;
      }

      _address = address ?? null;
      _description = description ?? null;
      _email = email ?? null;
      _name = name ?? null;
      _phone = phone ?? null;
      _website = website ?? null;

      const brand = await this.brandRepository
        .createQueryBuilder('brand')
        .insert()
        .into(BrandEntity)
        .values({
          address: _address,
          description: _description,
          email: _email,
          name: _name,
          phone: _phone,
          website: _website,
          avatar: _file,
        })
        .execute();

      if (!brand) {
        return new HttpBadRequest('Error creating brand');
      }

      const result = await this.findOne(brand.raw[0].uuid);

      if (!result) {
        return new HttpBadRequest('Error creating brand');
      }

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async query(query: QueryOptions): Promise<any> {
    try {
      let {_page, _limit, _sort, _order} = QueryOptions.initialize(query);

      const [brands, count] = await this.brandRepository
        .createQueryBuilder('brand')
        .loadAllRelationIds()
        .skip(_limit * (_page - 1))
        .take(_limit)
        .orderBy(`brand.${_sort}`, _order === 'DESC' ? 'DESC' : 'ASC')
        .getManyAndCount();

      return {
        data: brands,
        meta: new Meta(_page, _limit, brands.length, Math.ceil(count / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readOne(brandId: string): Promise<any> {
    try {
      const exist = await this.redisxService.getKey(`${CACHE_KEY.brand}:${brandId}`);

      if (exist) {
        return JSON.parse(exist);
      }

      const brand = await this.brandRepository
        .createQueryBuilder('brand')
        .loadAllRelationIds()
        .where({uuid: brandId})
        .getOne();

      if (!brand) {
        return new HttpForbidden('Brand not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.brand}:${brandId}`, JSON.stringify(brand));

      return brand;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readAll(): Promise<any> {
    try {
      const brands = await this.brandRepository.createQueryBuilder('brand').loadAllRelationIds().getMany();

      return brands;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async update(brandId: string, arg: UpdateBrandDTO, file: Express.Multer.File): Promise<any> {
    try {
      var {address, description, email, name, phone, website} = arg;

      const brand = await this.findOne(brandId);

      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const brandExistValue = await this.brandRepository.createQueryBuilder('brand').where({name: name}).getOne();

      if (brandExistValue) {
        return new HttpBadRequest("Brand's value already exist");
      }

      var _address: string, _description: string, _email: string, _name: string, _phone: string, _website: string;
      var _file: MediaEntity;

      _address = address ?? brand.address;
      _description = description ?? brand.description;
      _email = email ?? brand.email;
      _name = name ?? brand.name;
      _phone = phone ?? brand.phone;
      _website = website ?? brand.website;

      if (file) {
        const avatarUpload = await this.mediaService.uploadFile(file);
        if (!avatarUpload) {
          return new HttpBadRequest('Error uploading image');
        }
        _file = avatarUpload;
      } else {
        _file = brand.avatar;
      }

      const updatedBrand = await this.brandRepository
        .createQueryBuilder('brand')
        .update()
        .set({
          address: _address,
          description: _description,
          email: _email,
          name: _name,
          phone: _phone,
          website: _website,
          avatar: _file,
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

      await this.redisxService.delKey(`${CACHE_KEY.brand}:${brandId}`);

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async delete(brandId: string): Promise<any> {
    try {
      const brand = await this.findOne(brandId);

      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const response = await this.brandRepository
        .createQueryBuilder('brand')
        .softDelete()
        .where({uuid: brandId})
        .execute();

      if (!response) {
        return new HttpBadRequest('Error deleting brand');
      }

      await this.redisxService.delKey(`${CACHE_KEY.brand}:${brandId}`);

      return 'Brand deleted successfully';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteImage(brandId: string): Promise<any> {
    try {
      const brand = await this.findOne(brandId);

      if (!brand) {
        return new HttpBadRequest('Brand not found');
      }

      const response = await this.brandRepository
        .createQueryBuilder('brand')
        .update()
        .set({avatar: null})
        .where({uuid: brandId})
        .execute();

      if (!response) {
        return new HttpBadRequest('Error deleting image');
      }

      await this.redisxService.delKey(`${CACHE_KEY.brand}:${brandId}`);

      return 'Image deleted successfully';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
