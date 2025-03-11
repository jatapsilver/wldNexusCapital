import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositHistory } from 'src/entities/depositHistory.entity';
import { UserCompletedOrderDto } from 'src/purchase-order/Dtos/userCompletedOrderDto';
import { Repository } from 'typeorm';

@Injectable()
export class DepositHistoryRepository {
  constructor(
    @InjectRepository(DepositHistory)
    private readonly depositHistoryRepository: Repository<DepositHistory>,
  ) {}

  async createDepositHistory(
    id: string,
    userCompletedOrderDto: UserCompletedOrderDto,
    orderExisting: import('../entities/order.entity').Order[],
  ) {
    const walletDeposit = orderExisting[0].walletPrivate;
    const valueDeposit = orderExisting[0].package.price;
    const hashDeposit = userCompletedOrderDto.hash;
    const verifyHashDeposit = await this.depositHistoryRepository.findOne({
      where: { hashDeposit },
    });
    if (verifyHashDeposit) {
      throw new BadRequestException('Hash de transaccion invalido');
    }
    const newDeposit = this.depositHistoryRepository.create({
      walletDeposit,
      valueDeposit,
      hashDeposit,
      user: { uuid: id },
    });

    await this.depositHistoryRepository.save(newDeposit);
  }
}
