import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('[JwtAuthGuard] Checking authorization:', {
      hasAuthHeader: !!authHeader,
      authHeaderStart: authHeader ? authHeader.substring(0, 30) + '...' : 'none',
      path: request.path,
      method: request.method,
    });
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('[JwtAuthGuard] handleRequest:', {
      hasError: !!err,
      error: err?.message,
      hasUser: !!user,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      info: info?.message || info?.name || info,
    });

    if (err || !user) {
      console.error('[JwtAuthGuard] Authentication failed:', {
        error: err?.message,
        info: info?.message || info?.name || info,
      });
      throw err || new UnauthorizedException(info?.message || 'Authentication required');
    }
    
    return user;
  }
}
