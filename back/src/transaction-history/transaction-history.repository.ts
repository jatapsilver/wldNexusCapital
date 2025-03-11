import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHistory } from 'src/entities/transactionHistory.entity';
import { WithdrawalsHistoryRepository } from 'src/withdrawals-history/withdrawals-history.repository';

import { Repository } from 'typeorm';
import { CreateUserWithdrawalsDto } from './Dtos/createUserWithdrawals.dto';
import { Credential } from 'src/entities/credential.entity';
import { User } from 'src/entities/user.entity';
import { ProgressPackagesRepository } from 'src/progress-packages/progress-packages.repository';

@Injectable()
export class TransactionHistoryRepository {
  constructor(
    @InjectRepository(TransactionHistory)
    private readonly transactionHistoryRepository: Repository<TransactionHistory>,
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    private readonly withdrawalsHistoryRepository: WithdrawalsHistoryRepository,
    private readonly progressPackagesRepository: ProgressPackagesRepository,
  ) {}

  //metodo para trae las ultimas transacciones de un usuario
  async getLastTransactional(id: string) {
    return await this.transactionHistoryRepository.find({
      where: { user: { uuid: id } },
      order: { date: 'DESC' },
      take: 3,
    });
  }

  //logica para obtener el balance de un usuario
  async getBalance(id: string) {
    const userTransactions = await this.transactionHistoryRepository.findOne({
      where: { user: { uuid: id } },
      order: { date: 'DESC' },
    });
    return userTransactions;
  }

  //logica para obtener las transacciones de un usuario
  async getUserTrasictionHistoryRepository(id: string) {
    const userTransactions = await this.transactionHistoryRepository.find({
      where: { user: { uuid: id } },
      order: { date: 'DESC' },
    });

    const withdrawalHistory =
      await this.withdrawalsHistoryRepository.getUserLastWithdrawals(id);

    return { userTransactions, withdrawalHistory };
  }

  //metodo para crear un retiro
  async postCreateUserWithdrawalRepository(
    id: string,
    createUserWithdrawalsDto: CreateUserWithdrawalsDto,
  ) {
    // Validación: Solo se permiten retiros durante el sábado.
    const now = new Date();
    // En JavaScript, getDay() devuelve 6 para el sábado (0: domingo, 1: lunes, etc.)
    if (now.getDay() !== 6) {
      throw new BadRequestException(
        'Los retiros solo están habilitados entre las 00:00 horas del sábado hasta las 23:59 horas del sábado',
      );
    }

    const user = await this.credentialRepository.findOne({
      where: { user: { uuid: id } },
    });
    if (!user.walletPublica) {
      throw new BadRequestException(
        'No hay dirección de wallet para realizar retiros, por favor actualiza tus datos',
      );
    }

    const lastTransaction = await this.transactionHistoryRepository.findOne({
      where: { user: { uuid: id } },
      order: { date: 'DESC' },
    });
    const previousBalance = lastTransaction
      ? Number(lastTransaction.balance)
      : 0;
    const transactionValue = parseFloat(createUserWithdrawalsDto.value);

    if (previousBalance < Math.abs(transactionValue)) {
      throw new BadRequestException(
        'Saldo insuficiente para realizar el retiro',
      );
    }

    if (Math.abs(transactionValue) < 100) {
      throw new BadRequestException('El retiro mínimo es 100 Usdt');
    }

    const newBalance = previousBalance + transactionValue;
    const newTransaction = this.transactionHistoryRepository.create({
      user: { uuid: id },
      description: createUserWithdrawalsDto.description,
      value: transactionValue,
      balance: newBalance,
    });
    const savedTransaction =
      await this.transactionHistoryRepository.save(newTransaction);

    const newWithdrawal =
      await this.withdrawalsHistoryRepository.createUserWithdrawal(
        id,
        transactionValue,
        user.walletPublica,
      );
    return { transaction: savedTransaction, withdrawal: newWithdrawal };
  }

  //metodo para pagar comision del sponsor de primer nivel embajador
  async paidSponsorOneLevelAmbassador(
    sponsorOne: User,
    packageBuy: number,
    referred: string,
  ) {
    const lastTransaction = await this.transactionHistoryRepository.findOne({
      where: { user: { uuid: sponsorOne.uuid } },
      order: { date: 'DESC' },
    });

    const commission = parseFloat((packageBuy * 0.07).toFixed(2));

    const previousBalance = lastTransaction?.balance || 0;
    const numericPreviousBalance = Number(previousBalance);

    const newBalance = parseFloat(
      (numericPreviousBalance + commission).toFixed(2),
    );

    const newTransaction = this.transactionHistoryRepository.create({
      description: `Pago referido primer nivel ${referred}`,
      value: commission,
      user: sponsorOne,
      balance: newBalance,
    });
    return await this.transactionHistoryRepository.save(newTransaction);
  }

  //metodo para pagar comision del sponsor de segundo nivel embajador
  async paidSponsorTwoLevelAmbassador(
    sponsorTwo: User,
    packageBuy: number,
    referred: string,
  ) {
    const lastTransaction = await this.transactionHistoryRepository.findOne({
      where: { user: { uuid: sponsorTwo.uuid } },
      order: { date: 'DESC' },
    });

    const commission = parseFloat((packageBuy * 0.05).toFixed(2));

    const previousBalance = lastTransaction?.balance || 0;
    const numericPreviousBalance = Number(previousBalance);
    const newBalance = parseFloat(
      (numericPreviousBalance + commission).toFixed(2),
    );

    const newTransaction = this.transactionHistoryRepository.create({
      description: `Pago referido segundo nivel ${referred}`,
      value: commission,
      user: sponsorTwo,
      balance: newBalance,
    });

    return await this.transactionHistoryRepository.save(newTransaction);
  }
  //metodo para pagar comision del sponsor de segundo nivel embajador
  async paisSponsorThreeLevelAmbassador(
    sponsorThree: User,
    packageBuy: number,
    referred: string,
  ) {
    const lastTransaction = await this.transactionHistoryRepository.findOne({
      where: { user: { uuid: sponsorThree.uuid } },
      order: { date: 'DESC' },
    });

    const commission = parseFloat((packageBuy * 0.03).toFixed(2));

    const previousBalance = lastTransaction?.balance || 0;
    const numericPreviousBalance = Number(previousBalance);
    const newBalance = parseFloat(
      (numericPreviousBalance + commission).toFixed(2),
    );

    const newTransaction = this.transactionHistoryRepository.create({
      description: `Pago referido tercer nivel ${referred}`,
      value: commission,
      user: sponsorThree,
      balance: newBalance,
    });

    return await this.transactionHistoryRepository.save(newTransaction);
  }

  //metodo para pagar comision del sponsor de primer nivel
  async paidSponsorOneLevel(
    sponsorOne: User,
    packageBuy: number,
    referred: string,
  ) {
    const packageProgressExisting =
      await this.progressPackagesRepository.getProgressPackageUserByUuid(
        sponsorOne.uuid,
      );

    if (!packageProgressExisting) {
      return;
    } else {
      const valueDiferrence =
        packageProgressExisting.finalValue -
        packageProgressExisting.initialValue;
      const commission = parseFloat((packageBuy * 0.07).toFixed(2));
      if (commission < valueDiferrence) {
        await this.progressPackagesRepository.updatePackageProgress(
          sponsorOne.uuid,
          commission,
        );

        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: sponsorOne.uuid } },
            order: { date: 'DESC' },
          },
        );

        const previousBalance = lastTransaction?.balance || 0;
        const numericPreviousBalance = Number(previousBalance);

        const newBalance = parseFloat(
          (numericPreviousBalance + commission).toFixed(2),
        );

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Pago referido primer nivel ${referred}`,
          value: commission,
          user: sponsorOne,
          balance: newBalance,
        });
        return await this.transactionHistoryRepository.save(newTransaction);
      } else {
        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: sponsorOne.uuid } },
            order: { date: 'DESC' },
          },
        );

        const previousBalance = lastTransaction?.balance || 0;
        const numericPreviousBalance = Number(previousBalance);
        const newBalance = parseFloat(
          (numericPreviousBalance + valueDiferrence).toFixed(2),
        );

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Pago referido primer nivel ${referred}`,
          value: valueDiferrence,
          user: sponsorOne,
          balance: newBalance,
        });
        await this.progressPackagesRepository.updateStatusPackageProgress(
          sponsorOne.uuid,
        );
        return await this.transactionHistoryRepository.save(newTransaction);
      }
    }
  }

  //metodo para pagar comision del sponsor de segundo nivel
  async paidSponsorTwoLevel(
    sponsorTwo: User,
    packageBuy: number,
    referred: string,
  ) {
    const packageProgressExisting =
      await this.progressPackagesRepository.getProgressPackageUserByUuid(
        sponsorTwo.uuid,
      );

    if (!packageProgressExisting) {
      return;
    } else {
      const valueDifference =
        packageProgressExisting.finalValue -
        packageProgressExisting.initialValue;
      const commission = parseFloat((packageBuy * 0.05).toFixed(2));

      if (commission < valueDifference) {
        await this.progressPackagesRepository.updatePackageProgress(
          sponsorTwo.uuid,
          commission,
        );

        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: sponsorTwo.uuid } },
            order: { date: 'DESC' },
          },
        );

        const previousBalance = lastTransaction?.balance || 0;
        const numericPreviousBalance = Number(previousBalance);
        const newBalance = parseFloat(
          (numericPreviousBalance + commission).toFixed(2),
        );

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Pago referido segundo nivel ${referred}`,
          value: commission,
          user: sponsorTwo,
          balance: newBalance,
        });

        return await this.transactionHistoryRepository.save(newTransaction);
      } else {
        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: sponsorTwo.uuid } },
            order: { date: 'DESC' },
          },
        );

        const previousBalance = lastTransaction?.balance || 0;
        const numericPreviousBalance = Number(previousBalance);
        const newBalance = parseFloat(
          (numericPreviousBalance + valueDifference).toFixed(2),
        );

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Pago referido segundo nivel ${referred}`,
          value: valueDifference,
          user: sponsorTwo,
          balance: newBalance,
        });

        await this.progressPackagesRepository.updateStatusPackageProgress(
          sponsorTwo.uuid,
        );

        return await this.transactionHistoryRepository.save(newTransaction);
      }
    }
  }
  //metodo para pagar comision del sponsor de tercer nivel
  async paidSponsorThreeLevel(
    sponsorThree: User,
    packageBuy: number,
    referred: string,
  ) {
    const packageProgressExisting =
      await this.progressPackagesRepository.getProgressPackageUserByUuid(
        sponsorThree.uuid,
      );

    if (!packageProgressExisting) {
      return;
    } else {
      const valueDifference =
        packageProgressExisting.finalValue -
        packageProgressExisting.initialValue;
      const commission = parseFloat((packageBuy * 0.03).toFixed(2));

      if (commission < valueDifference) {
        await this.progressPackagesRepository.updatePackageProgress(
          sponsorThree.uuid,
          commission,
        );

        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: sponsorThree.uuid } },
            order: { date: 'DESC' },
          },
        );

        const previousBalance = lastTransaction?.balance || 0;
        const numericPreviousBalance = Number(previousBalance);
        const newBalance = parseFloat(
          (numericPreviousBalance + commission).toFixed(2),
        );

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Pago referido tercer nivel ${referred}`,
          value: commission,
          user: sponsorThree,
          balance: newBalance,
        });

        return await this.transactionHistoryRepository.save(newTransaction);
      } else {
        const lastTransaction = await this.transactionHistoryRepository.findOne(
          {
            where: { user: { uuid: sponsorThree.uuid } },
            order: { date: 'DESC' },
          },
        );

        const previousBalance = lastTransaction?.balance || 0;
        const numericPreviousBalance = Number(previousBalance);
        const newBalance = parseFloat(
          (numericPreviousBalance + valueDifference).toFixed(2),
        );

        const newTransaction = this.transactionHistoryRepository.create({
          description: `Pago referido tercer nivel ${referred}`,
          value: valueDifference,
          user: sponsorThree,
          balance: newBalance,
        });

        await this.progressPackagesRepository.updateStatusPackageProgress(
          sponsorThree.uuid,
        );

        return await this.transactionHistoryRepository.save(newTransaction);
      }
    }
  }
}
