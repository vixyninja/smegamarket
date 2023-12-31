import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Environment} from '../environments';
import {HttpUnauthorized, RoleEnum} from '@/core';

export type JWTPayload = {
  uuid: string;
  role: RoleEnum;
  email: string;
  [key: string]: any;
};

export type TokenType = 'accessToken' | 'refreshToken';

export const RecordType: Record<TokenType, Record<string, string>> = {
  accessToken: {
    secret: Environment.ACCESS_TOKEN_SECRET,
    expiration: Environment.ACCESS_TOKEN_EXPIRATION_TIME,
    audience: 'access-token',
    issuer: 'This is a access token',
  },
  refreshToken: {
    secret: Environment.REFRESH_TOKEN_SECRET,
    expiration: Environment.REFRESH_TOKEN_EXPIRATION_TIME,
    audience: 'refresh-token',
    issuer: 'This is a refresh token',
  },
};

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  signToken(payload: JWTPayload, type: TokenType): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = this.jwtService.sign(payload, {
          secret: RecordType[type].secret,
          expiresIn: RecordType[type].expiration,
          audience: RecordType[type].audience,
          issuer: RecordType[type].issuer,
          algorithm: 'HS256',
        });

        const tokenBuffer = Buffer.from(token).toString(Environment.TOKEN_BUFFER as any);

        resolve(tokenBuffer);
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          reject(new HttpUnauthorized('Token is expired'));
        } else if (error.name === 'JsonWebTokenError') {
          reject(new HttpUnauthorized('Token is invalid'));
        } else if (error.name === 'NotBeforeError') {
          reject(new HttpUnauthorized('Token is not active'));
        } else {
          reject(error);
        }
      }
    });
  }

  verifyToken(token: string, type: TokenType): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      try {
        const tokenDecoded = Buffer.from(token, Environment.TOKEN_BUFFER as any).toString();

        const payload = this.jwtService.verify(tokenDecoded, {
          secret: RecordType[type].secret,
          audience: RecordType[type].audience,
          issuer: RecordType[type].issuer,
          algorithms: ['HS256'],
        });

        resolve(payload);
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          reject(new HttpUnauthorized('Token is expired'));
        } else if (error.name === 'JsonWebTokenError') {
          reject(new HttpUnauthorized('Token is invalid'));
        } else if (error.name === 'NotBeforeError') {
          reject(new HttpUnauthorized('Token is not active'));
        } else {
          reject(error);
        }
      }
    });
  }
}
