import {Environment, JWTService, RedisxService} from '@/configs';
import {JWTPayload} from '@/configs/jwt/typedef';
import {HttpBadRequest, RoleEnum} from '@/core';
import {CreateUserDTO, UserEntity, UserService} from '@/modules/user';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import {Repository} from 'typeorm';
import {SignInEmailDTO, SignInGoogleDTO} from './dto';

interface AuthServiceInterface {
  signInGoogle(signInGoogleDTO: SignInGoogleDTO): Promise<any>;
  signInFacebook(): Promise<any>;
  signUpEmailAndPassword(signInEmailDTO: SignInEmailDTO): Promise<any>;
  signInEmailAndPassword(): Promise<any>;
  signOut(): Promise<any>;
  forgotPassword(): Promise<any>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly redisService: RedisxService,
    private readonly jwtService: JWTService,
  ) {}
  async signInGoogle(signInGoogleDTO: SignInGoogleDTO): Promise<any> {
    try {
      const {deviceToken, deviceType, idToken} = signInGoogleDTO;
      const client: OAuth2Client = new OAuth2Client(Environment.GOOGLE_CLIENT_ID);
      const ticker: LoginTicket = await client.verifyIdToken({
        idToken: idToken,
        audience: Environment.GOOGLE_CLIENT_ID,
        maxExpiry: 1000 * 60 * 60 * 24 * 7,
      });

      const payload: TokenPayload = ticker.getPayload();

      return null;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
  signInFacebook(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async signUpEmailAndPassword(signInEmailDTO: SignInEmailDTO): Promise<any> {
    try {
      const {deviceToken, deviceType, email, password, firstName, lastName} = signInEmailDTO;
      const user: UserEntity = await this.userService.findByEmail(email);
      console.log(user);
      if (user) return new HttpBadRequest('Email already exists');
      const createUserDTO: CreateUserDTO = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const newUser: UserEntity = await this.userService.createUser(createUserDTO);
      const payload: JWTPayload = {
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: email,
        role: RoleEnum.USER,
        uuid: newUser.uuid,
      };
      const accessToken = await this.jwtService.signToken(payload, 'accessToken');
      const refreshToken = await this.jwtService.signToken(payload, 'refreshToken');
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
  signInEmailAndPassword(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  signOut(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  forgotPassword(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
