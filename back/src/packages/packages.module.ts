import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { PackagesRepository } from './packages.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from 'src/entities/package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  controllers: [PackagesController],
  providers: [PackagesService, PackagesRepository],
  exports: [PackagesService, TypeOrmModule],
})
export class PackagesModule {}
