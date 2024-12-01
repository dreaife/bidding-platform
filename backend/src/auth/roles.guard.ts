import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // console.log('guard request user', request.user);

    // console.log('guard context', context);

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // console.log('requiredRoles', requiredRoles);
    if (!requiredRoles) {
      return false;
    }
    const { user } = request;
    // console.log('user', user);
    const userRoles = user?.role;
    return requiredRoles.includes(userRoles);
  }
}
