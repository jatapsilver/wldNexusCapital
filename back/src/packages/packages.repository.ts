import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from 'src/entities/package.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackagesRepository {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async getAllPackagesRepository() {
    return this.packageRepository.find();
  }
}
