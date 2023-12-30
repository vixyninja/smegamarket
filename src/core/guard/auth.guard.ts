import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JWTService } from 'src/configs';
import { HttpUnauthorized, PUBLIC_ROUTE_KEY, } from 'src/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JWTService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return this.validateAuth(request);
  }

  private async validateAuth(request: Request): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyToken(this.extractTokenFromHeader(request), 'accessToken');
      if (!decoded) throw new HttpUnauthorized();
      request['user'] = decoded;
      return true;
    } catch (error) {
      throw error;
    }
  }

  private extractTokenFromHeader(request: Request): string {
    if (!request.headers['authorization']) throw new UnauthorizedException('No token provided');
    if (!request.headers['authorization'].startsWith('Bearer ')) throw new UnauthorizedException('Invalid token');
    const token = request.headers['authorization'].split(' ');
    return token[1];
  }
}
