import {HttpBadRequest, HttpForbidden, HttpInternalServerError} from '@/core';
import {Meta, QueryOptions} from '@/core/interface';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MediaEntity, MediaService} from '../media';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';
import {BrandEntity} from './entities';

interface BrandServiceInterface {
  findOne(brandId: string): Promise<any>;
  findByName(name: string): Promise<any>;

  create(arg: CreateBrandDTO, file: Express.Multer.File): Promise<any>;
  query(query: QueryOptions): Promise<any>;
  readOne(brandId: string): Promise<any>;
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
        .where({name: name})
        .getOne();

      return brand;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async create(arg: CreateBrandDTO, file: Express.Multer.File): Promise<any> {
    try {
      const {address, description, email, name, phone, website} = arg;

      const brandExist = await this.brandRepository
        .createQueryBuilder('brand')
        .where({name: name})
        .orWhere({email: email})
        .orWhere({phoneNumber: phone})
        .orWhere({website: website})
        .getOne();

      if (brandExist) {
        return new HttpBadRequest('Brand already exist');
      }

      const avatarUpload = await this.mediaService.uploadFile(file);

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
          phone: phone,
          website: website,
          avatar: avatarUpload,
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
      const brand = await this.brandRepository
        .createQueryBuilder('brand')
        .loadAllRelationIds()
        .where({uuid: brandId})
        .getOne();

      if (!brand) {
        return new HttpForbidden('Brand not found');
      }

      return brand;
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

      const brandExistValue = await this.brandRepository
        .createQueryBuilder('brand')
        .where({name: name})
        .orWhere({email: email})
        .orWhere({phoneNumber: phone})
        .orWhere({website: website})
        .getOne();

      if (brandExistValue) {
        return new HttpBadRequest("Brand's value already exist");
      }

      var _address: string, _description: string, _email: string, _name: string, _phoneNumber: string, _website: string;
      var _file: MediaEntity;

      _address = address ?? brand.address;
      _description = description ?? brand.description;
      _email = email ?? brand.email;
      _name = name ?? brand.name;
      _phoneNumber = phone ?? brand.phoneNumber;
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
          phone: _phoneNumber,
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

      const file = await this.mediaService.findFile('26daf89b-4fac-4b0e-881f-518a6eceba10');

      if (!file) {
        return new HttpBadRequest('File not found');
      }

      const response = await this.brandRepository
        .createQueryBuilder('brand')
        .update()
        .set({avatar: file})
        .where({uuid: brandId})
        .execute();

      if (!response) {
        return new HttpBadRequest('Error deleting image');
      }

      return 'Image deleted successfully';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
