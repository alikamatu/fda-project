import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      console.log('[RolesGuard] No roles required for this endpoint');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    console.log('[RolesGuard] Checking roles:', { 
      requiredRoles, 
      userRole: user?.role, 
      userEmail: user?.email 
    });
    
    if (!user) {
      console.error('[RolesGuard] No user found in request');
      throw new ForbiddenException('No authentication provided');
    }

    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      console.error('[RolesGuard] User lacks required role:', { 
        userRole: user.role, 
        requiredRoles 
      });
      throw new ForbiddenException(`Required roles: ${requiredRoles.join(', ')}`);
    }

    console.log('[RolesGuard] Role validation successful');
    return true;
  }
}