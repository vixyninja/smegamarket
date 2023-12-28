import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {JWTPayload, RecordType, TokenType} from './type.jwt';
import {Environment} from '../environments';
import {HttpUnauthorized} from '@/core';

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
