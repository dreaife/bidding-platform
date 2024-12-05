import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    // console.log('requiredRoles', requiredRoles);

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    // console.log('token', token);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    console.log('user', user);

    request.user = user; // 将用户信息添加到请求中
    return requiredRoles.includes(user.role as Role);
  }
}
