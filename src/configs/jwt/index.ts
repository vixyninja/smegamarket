import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Environment} from '../environments';

export type JWTPayload = {
  uid: string;
  role: any;
  email: string;
};

type Token = 'access' | 'refresh';

const common: Record<Token, Record<string, string>> = {
  access: {
    secret: Environment.ACCESS_TOKEN_SECRET,
    expiration: Environment.ACCESS_TOKEN_EXPIRATION_TIME,
  },
  refresh: {
    secret: Environment.REFRESH_TOKEN_SECRET,
    expiration: Environment.REFRESH_TOKEN_EXPIRATION_TIME,
  },
};

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  signToken(payload: JWTPayload, type: Token): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          expiresIn: common[type].expiration,
          secret: common[type].secret,
        };
        const token = this.jwtService.sign(payload, options);
        resolve(token);
      } catch (error: any) {
        reject(error);
      }
    });
  }

  verifyToken(token: string, type: Token): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: common[type].expiration,
        secret: common[type].secret,
      };
      try {
        const payload = this.jwtService.verify(token, options);
        resolve(payload);
      } catch (error: any) {
        reject(error);
      }
    });
  }
}
