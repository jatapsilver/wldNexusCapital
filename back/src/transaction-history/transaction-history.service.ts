import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { TransactionHistoryRepository } from './transaction-history.repository';
import { CreateUserWithdrawalsDto } from './Dtos/createUserWithdrawals.dto';

@Injectable()
export class TransactionHistoryService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
  ) {}

  async getUserTrasictionHistoryService(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    return await this.transactionHistoryRepository.getUserTrasictionHistoryRepository(
      id,
    );
  }
  //servicio para realizar un retiro
  async postCreateUserWithdrawalService(
    id: string,
    createUserWithdrawalsDto: CreateUserWithdrawalsDto,
  ) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    return await this.transactionHistoryRepository.postCreateUserWithdrawalRepository(
      id,
      createUserWithdrawalsDto,
    );
  }
}
