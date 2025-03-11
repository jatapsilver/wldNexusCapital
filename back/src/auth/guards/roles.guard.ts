import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { ProfileUser } from '../../enums/profileUser/profileUser.enum';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ProfileUser[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest<CustomRequest>();

    if (!requiredRoles) return true;

    const user = request.user;

    if (!user) throw new ForbiddenException('Usuario No autorizado');

    const hasRole = user?.profile?.some((profile) =>
      requiredRoles.includes(profile),
    );

    if (!hasRole)
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta ruta',
      );

    return true;
  }
}
