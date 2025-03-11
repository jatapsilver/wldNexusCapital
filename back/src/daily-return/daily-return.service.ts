import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageProgress } from 'src/entities/packageProgress.entity';
import { TransactionHistory } from 'src/entities/transactionHistory.entity';
import { PackageProgressStatus } from 'src/enums/packageProgress/packageProgress.enum';
import { Repository } from 'typeorm';

@Injectable()
export class DailyReturnService {
  constructor(
    @InjectRepository(PackageProgress)
    private readonly packageProgressRepository: Repository<PackageProgress>,
    @InjectRepository(TransactionHistory)
    private readonly transactionHistoryRepository: Repository<TransactionHistory>,
  ) {}

  @Cron('0 0 * * *')
  async processDailyReturn() {
    console.log('🕒 Iniciando processDailyReturn');
    const packageDailyReturn = await this.packageProgressRepository.find({
      where: { status: PackageProgressStatus.IN_PROGRESS },
      relations: ['order', 'order.package', 'user', 'user.credential'],
    });
    console.log(
      '🤖 Paquetes en progreso encontrados:',
      packageDailyReturn.length,
    );

    // Si no hay paquetes en progreso, se imprime el mensaje y se finaliza la ejecución.
    if (packageDailyReturn.length === 0) {
      console.log('📦 Todos los paquetes están completos');
      return;
    }

    // Iteramos sobre cada paquete en progreso
    for (const pkg of packageDailyReturn) {
      // Convertir a número los valores necesarios
      const packageBuy = Number(pkg.order.package.price);
      const finalValue = Number(pkg.finalValue);
      const initialValue = Number(pkg.initialValue);

      // Definir el rango de porcentaje aleatorio (entre 0.85% y 1.1%)
      const minPercentage = 0.0085;
      const maxPercentage = 0.011;
      const randomPercentage =
        Math.random() * (maxPercentage - minPercentage) + minPercentage;
      // Calcular la comisión diaria
      const comissionDaily = packageBuy * randomPercentage;

      // Diferencia pendiente para alcanzar el valor final
      const valueDifference = finalValue - initialValue;

      if (comissionDaily < valueDifference) {
        // Caso: el rendimiento diario es menor que la diferencia pendiente
        const newInitialValue = initialValue + comissionDaily;
        const newPercentage = (newInitialValue / finalValue) * 100;

        await this.packageProgressRepository.update(
          { uuid: pkg.uuid },
          { initialValue: newInitialValue, percentage: newPercentage },
        );

        // Buscar la última transacción del usuario
        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: pkg.user.uuid } },
            order: { date: 'DESC' },
          },
        );
        const previousBalance = Number(lastTransaction?.balance || 0);

        const newBalance = previousBalance + comissionDaily;

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Rendimiento Diario`,
          value: comissionDaily,
          user: pkg.user,
          balance: newBalance,
        });
        console.log(
          `Pago de comisión diario por ${comissionDaily} a ${pkg.user.credential.username}`,
        );
        await this.transactionHistoryRepository.save(newTransaction);
      } else {
        // Caso: el rendimiento diario alcanza o supera la diferencia pendiente
        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: pkg.user.uuid } },
            order: { date: 'DESC' },
          },
        );
        const previousBalance = Number(lastTransaction?.balance || 0);
        const newBalance = previousBalance + valueDifference;
        const newTransaction = this.transactionHistoryRepository.create({
          description: `Rendimiento Diario`,
          value: valueDifference,
          user: pkg.user,
          balance: newBalance,
        });
        console.log(
          `💰 Pago de comisión diario por ${valueDifference} a ${pkg.user.credential.username}`,
        );
        // Actualizar el estado del paquete a COMPLETED
        await this.packageProgressRepository.update(
          { uuid: pkg.uuid },
          { status: PackageProgressStatus.COMPLETED },
        );
        await this.transactionHistoryRepository.save(newTransaction);
      }
    }
  }
}
