import { Injectable } from '@nestjs/common';
import { PackagesRepository } from './packages.repository';

@Injectable()
export class PackagesService {
  constructor(private readonly packagesRepository: PackagesRepository) {}
  getAllPackagesService() {
    return this.packagesRepository.getAllPackagesRepository();
  }
}
