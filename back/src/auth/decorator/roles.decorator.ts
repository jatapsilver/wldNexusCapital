import { SetMetadata } from '@nestjs/common';
import { ProfileUser } from '../../enums/profileUser/profileUser.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ProfileUser[]) => SetMetadata(ROLES_KEY, roles);
