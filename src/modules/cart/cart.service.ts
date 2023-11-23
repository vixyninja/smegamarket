import {RedisxService} from '@/configs';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserService} from '../user';
import {CreateCartItemDTO, UpdateCartDTO, UpdateCartItemDTO} from './dto';
import {CartEntity, CartItemEntity} from './entities';
import {CACHE_KEY, HttpBadRequest, HttpForbidden, HttpInternalServerError, HttpNotFound} from '@/core';
import {ProductEntity, ProductService, SizeEnum} from '../product';
import {isUUID} from 'class-validator';

interface CartServiceInterface {
  getCart(userId: string): Promise<any>;
  initCart(userId: string): Promise<any>;
  createCart(userId: string): Promise<any>;
  updateCart(userId: string, arg: UpdateCartDTO): Promise<any>;
  createCartItem(userId: string, arg: CreateCartItemDTO): Promise<any>;
  updateCartItem(userId: string, cartItemId: string, arg: UpdateCartItemDTO): Promise<any>;
  deleteCartItem(userId: string, cartItemId: string): Promise<any>;
  order(userId: string): Promise<any>;
}

@Injectable()
export class CartService implements CartServiceInterface {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly redisxService: RedisxService,
  ) {}

  async getCart(userId: string): Promise<any> {
    try {
      const user = await this.userService.readUser(userId);

      if (!user) {
        return new HttpNotFound('User not found');
      }

      const cartRedis = await this.redisxService.getKey(`${CACHE_KEY.cart}:${userId}`);

      if (cartRedis) {
        return {
          message: 'Get cart successfully',
          data: JSON.parse(cartRedis),
        };
      }

      const cart = await this.cartRepository
        .createQueryBuilder('cart')
        .where('cart.userId = :userId', {userId})
        .leftJoinAndSelect('cart.cart_item', 'cart_item')
        .leftJoinAndSelect('cart_item.product', 'product')
        .getOne();

      if (!cart) {
        return new HttpBadRequest('Something went wrong');
      }

      await this.redisxService.setKey(`${CACHE_KEY.cart}:${userId}`, JSON.stringify(cart));

      return {
        message: 'Get cart successfully',
        data: cart,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async initCart(userId: string): Promise<any> {
    try {
      const user = await this.userService.readUser(userId);

      if (!user) {
        return new HttpNotFound('User not found');
      }

      const cart = await this.cartRepository.save({
        user: user,
        totalPrice: 0,
      });

      if (!cart) {
        return new HttpBadRequest('Something went wrong');
      }

      return cart;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async createCart(userId: string): Promise<any> {
    try {
      const user = await this.userService.readUser(userId);

      if (!user) {
        return new HttpNotFound('User not found');
      }

      const cart = await this.cartRepository
        .createQueryBuilder('cart')
        .where('cart.userId = :userId', {userId})
        .leftJoinAndSelect('cart.cart_item', 'cart_item')
        .leftJoinAndSelect('cart_item.product', 'product')
        .getOne();

      if (cart) {
        return new HttpBadRequest('Cart already exists');
      }

      const newCart = this.cartRepository.create({
        user,
        totalPrice: 0,
      });

      if (!newCart) {
        return new HttpBadRequest('Create cart failed');
      }

      await this.cartRepository.save(newCart);

      return {
        message: 'Create cart successfully',
        data: newCart,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateCart(userId: String): Promise<any> {
    try {
      return new HttpInternalServerError(
        `This feature is not supported yet, please wait for the next version. Thank you! ${userId}`,
      );
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async createCartItem(userId: string, arg: CreateCartItemDTO): Promise<any> {
    try {
      const user = await this.userService.readUser(userId);

      if (!user) {
        return new HttpNotFound('User not found');
      }

      const cartInstance = await this.cartRepository
        .createQueryBuilder('cart')
        .where('cart.userId = :userId', {userId})
        .getOne();

      if (!cartInstance) {
        return new HttpNotFound('Cart not found');
      }

      const {brandId, price, productId, quantity, size} = arg;

      const product: ProductEntity = await this.productService.readOne(productId);

      if (!product) {
        return new HttpNotFound('Product not found');
      }

      if (SizeEnum[size] === undefined) {
        return new HttpBadRequest('Size is not valid');
      }

      const cartItem = await this.cartItemRepository.save({
        cart: cartInstance,
        brandId: brandId,
        price: price,
        product: product,
        size: SizeEnum[size],
        quantity: quantity,
      });

      if (!cartItem) {
        return new HttpBadRequest('Create cart item failed');
      }

      return cartItem;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateCartItem(userId: string, cartItemId: string, arg: UpdateCartItemDTO): Promise<any> {
    try {
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteCartItem(userId: string, cartItemId: string): Promise<any> {
    try {
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async order(userId: string): Promise<any> {
    try {
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
