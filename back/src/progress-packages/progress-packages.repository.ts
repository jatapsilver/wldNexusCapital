import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { PackageProgress } from 'src/entities/packageProgress.entity';
import { User } from 'src/entities/user.entity';
import { PackageProgressStatus } from 'src/enums/packageProgress/packageProgress.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ProgressPackagesRepository {
  constructor(
    @InjectRepository(PackageProgress)
    private readonly packageProgressRepository: Repository<PackageProgress>,
  ) {}

  async getLastProgressPackage(id: string) {
    return await this.packageProgressRepository.findOne({
      where: {
        user: { uuid: id },
        status: PackageProgressStatus.IN_PROGRESS,
      },
      order: { startDate: 'DESC' },
    });
  }

  async getUserPackageProgressRepository(id: string) {
    return await this.packageProgressRepository.find({
      where: { user: { uuid: id }, status: PackageProgressStatus.IN_PROGRESS },
      relations: ['order', 'order.package'],
    });
  }

  async getProgressPackageUserByUuid(id: string) {
    return await this.packageProgressRepository.findOne({
      where: { user: { uuid: id }, status: PackageProgressStatus.IN_PROGRESS },
    });
  }

  //metodo para finalizar un paquete
  async updateStatusPackageProgress(uuid: string) {
    const packageProgress = await this.packageProgressRepository.findOne({
      where: {
        user: { uuid: uuid },
        status: PackageProgressStatus.IN_PROGRESS,
      },
    });

    packageProgress.status = PackageProgressStatus.COMPLETED;

    return await this.packageProgressRepository.save(packageProgress);
  }

  //metodo para actualizar el progresso de paquete por comision
  async updatePackageProgress(uuid: string, commission: number) {
    const packageProgress = await this.packageProgressRepository.findOne({
      where: {
        user: { uuid },
        status: PackageProgressStatus.IN_PROGRESS,
      },
    });

    if (!packageProgress) {
      throw new NotFoundException('No se encontró el progreso del paquete');
    }

    // Asegurarse de que los valores sean numéricos
    const initialValue = Number(packageProgress.initialValue);
    const finalValue = Number(packageProgress.finalValue);

    const newInitialValue = initialValue + commission;
    const newPercentage = (newInitialValue / finalValue) * 100;

    await this.packageProgressRepository.update(
      { uuid: packageProgress.uuid },
      {
        initialValue: newInitialValue,
        percentage: newPercentage,
      },
    );

    return await this.packageProgressRepository.findOne({
      where: { uuid: packageProgress.uuid },
    });
  }

  //metodo para hacer el upgrade de un paquete
  async createProgressPackagesUpgrade(user: User, order: Order) {
    const progressPackage = await this.packageProgressRepository.findOne({
      where: {
        user: { uuid: user.uuid },
        status: PackageProgressStatus.IN_PROGRESS,
      },
    });
    const restValue = progressPackage.finalValue - progressPackage.initialValue;
    const finalValue = order.package.price * 2 + restValue;

    await this.packageProgressRepository.update(
      { uuid: progressPackage.uuid },
      {
        status: PackageProgressStatus.COMPLETED,
        endDate: new Date(),
      },
    );
    const newProgressPackage = this.packageProgressRepository.create({
      finalValue,
      user,
      initialValue: 0.0,
      percentage: 0.0,
      order,
    });
    return await this.packageProgressRepository.save(newProgressPackage);
  }

  //metodo para crear un nuevo paquete
  async createProgressPackagesNew(user: User, order: Order) {
    const finalValue = order.package.price * 2;
    const newProgressPackage = this.packageProgressRepository.create({
      finalValue,
      user,
      initialValue: 0.0,
      percentage: 0.0,
      order,
    });
    return await this.packageProgressRepository.save(newProgressPackage);
  }
}
