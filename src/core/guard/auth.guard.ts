import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';

import {JWTService} from 'src/configs';
import {IS_PUBLIC_KEY} from '../decorators';
import {HttpUnauthorized} from '../filter';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JWTService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return this.validateAuth(request);
  }

  private async validateAuth(request: Request): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyToken(this.extractTokenFromHeader(request), 'access');
      if (!decoded) throw new HttpUnauthorized();
      request['user'] = decoded;
      return true;
    } catch (error) {
      throw new HttpUnauthorized();
    }
  }

  private extractTokenFromHeader(request: Request): string {
    if (!request.headers['authorization']) throw new Error('No token provided');
    if (!request.headers['authorization'].startsWith('Bearer ')) throw new Error('Invalid token');
    const token = request.headers['authorization'].split(' ');
    return token[1];
  }
}
