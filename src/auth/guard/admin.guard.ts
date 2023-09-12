import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {HttpUnauthorized} from 'src/core';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (this.validateAdmin(request)) return true;
    throw new HttpUnauthorized();
  }

  private validateAdmin(request: Request): boolean {
    console.log(request['user']);
    if (request['user'].role === 'admin') return true;
    return false;
  }
}
