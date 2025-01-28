import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { TokenMissingException } from '../exception/token-missing.exception';
import { TokenInvalidException } from '../exception/token-invalid.exception';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.reflector.get<boolean>('isPublic', context.getHandler())) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  // eslint-disable-next-line @typescript-eslint/typedef
  validateRequest(request): boolean {
    // if (
    //   process.env.NODE_ENV == 'local' &&
    //   !request.headers['x-auth-user-data']
    // ) {
    //   request['user'] = {
    //     userId: '12345',
    //     type: 'user',
    //   };
    //   return true;
    // }

    if (!request.headers['x-auth-user-data']) {
      throw new TokenMissingException();
    }

    try {
      const user = jwt.verify(
        request.headers['x-auth-user-data'],
        process.env.INTERNAL_API_SECRET,
      );

      request['user'] = user;
      return true;
    } catch (e) {
      throw new TokenInvalidException();
    }
  }
}
