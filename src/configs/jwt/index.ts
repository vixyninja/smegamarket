import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {JWTPayload, RecordType, TokenType} from './typedef';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  signToken(payload: JWTPayload, type: TokenType): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          expiresIn: RecordType[type].expiration,
          secret: RecordType[type].secret,
        };
        const token = this.jwtService.sign(payload, options);
        resolve(token);
      } catch (error: any) {
        reject(error);
      }
    });
  }

  verifyToken(token: string, type: TokenType): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: RecordType[type].expiration,
        secret: RecordType[type].secret,
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
