import {Environment} from '@/configs';
import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Request} from 'express';
import {ExtractJwt, Strategy} from 'passport-firebase-jwt';
import {HttpBadRequest} from 'src/core';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string, req: Request): Promise<any> {
    try {
      const decodedToken = await this.jwtService
        .verifyAsync(token, {
          algorithms: ['RS256'],
          publicKey: Environment.APP_SECRET.replace(/\\n/g, '\n'),
        })
        .then((decodedToken) => {
          return decodedToken;
        })
        .catch((error) => {
          throw new HttpBadRequest('Token signature invalid');
        });
      if (!decodedToken) {
        throw new HttpBadRequest('Token signature invalid');
      }
      req['user'] = decodedToken;
      return decodedToken;
    } catch (error) {
      throw new HttpBadRequest('Token signature invalid');
    }
  }
}
