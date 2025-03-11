import { BadRequestException, Injectable } from '@nestjs/common';
import { ProgressPackagesRepository } from './progress-packages.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class ProgressPackagesService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly progressPackagesRepository: ProgressPackagesRepository,
  ) {}

  async getUserPackageProgressService(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    return await this.progressPackagesRepository.getUserPackageProgressRepository(
      id,
    );
  }
}
