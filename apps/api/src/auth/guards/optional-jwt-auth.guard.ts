import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, isObservable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    // Try to authenticate, but don't fail if not authenticated
    try {
      const result = super.canActivate(context);
      if (result instanceof Promise) {
        await result;
      } else if (isObservable(result)) {
        await firstValueFrom(result);
      }
      return true;
    } catch {
      return true;
    }
  }

  handleRequest(err, user, info, context) {
    // Return user if authenticated, otherwise return undefined
    return user || null;
  }
}