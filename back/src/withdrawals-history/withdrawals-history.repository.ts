import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawalsHistory } from 'src/entities/withdrawalsHistory.entity';
import { WithdrawalStatus } from 'src/enums/withdrawalStatus/withdrawalStatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class WithdrawalsHistoryRepository {
  constructor(
    @InjectRepository(WithdrawalsHistory)
    private readonly withdrawalsHistoryRepository: Repository<WithdrawalsHistory>,
  ) {}
  //metodo para traer loss ultimos retiros de un usuario
  async getLastWithdrawals(id: string) {
    return await this.withdrawalsHistoryRepository.find({
      where: { user: { uuid: id } },
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }
  //metodo para traer la ultima transaccion en procceso
  async getUserLastWithdrawals(id: string) {
    return await this.withdrawalsHistoryRepository.findOne({
      where: { user: { uuid: id }, status: WithdrawalStatus.PROCESSING },
      order: { createdAt: 'DESC' },
    });
  }
  // metodo para crear un retiro
  async createUserWithdrawal(
    id: string,
    transactionValue: number,
    walletAddress: string,
  ) {
    const newWithdrawals = this.withdrawalsHistoryRepository.create({
      user: { uuid: id },
      amount: Math.abs(transactionValue),
      walletAddress,
      status: WithdrawalStatus.PROCESSING,
    });
    await this.withdrawalsHistoryRepository.save(newWithdrawals);
    return newWithdrawals;
  }
}
