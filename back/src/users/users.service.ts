import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { TransactionHistoryRepository } from 'src/transaction-history/transaction-history.repository';
import { ProgressPackagesRepository } from 'src/progress-packages/progress-packages.repository';
import { WithdrawalsHistoryRepository } from 'src/withdrawals-history/withdrawals-history.repository';
import { UpdateInformationUserDto } from './Dtos/updateInformationUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly progressPackagesRepository: ProgressPackagesRepository,
    private readonly withdrawalsHistoryRepository: WithdrawalsHistoryRepository,
  ) {}
  //metodo para buscar la informacion de nombre y correo de un usuario por uuid
  async GetBasicInformationService(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }

    const userBasic = [user.name, user.email];
    return userBasic;
  }

  async getInformationUserService(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    const sponsor = await this.userRepository.getUserByUUIDRepository(
      user.sponsor,
    );

    const userInformation = {
      name: user.name,
      email: user.email,
      sponsor: sponsor.credential.username,
      birthdate: user.birthdate,
      country: user.country,
      celphone: user.celphone,
      createdAt: user.createdAt,
      credential: {
        username: user.credential.username,
        profile: user.credential.profile,
        walletPublica: user.credential.walletPublica,
      },
    };
    return userInformation;
  }
  // metodo para buscar la informacion del componente de inicio del front
  async GetInformationStartService(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }

    let progressPackage;

    if (user.credential.profile === 'ambassador') {
      progressPackage = { message: 'Usuario embajador, sin progreso activo.' };
    } else {
      progressPackage =
        await this.progressPackagesRepository.getLastProgressPackage(id);
    }

    const userTransactions =
      await this.transactionHistoryRepository.getBalance(id);

    const balance = userTransactions?.balance ?? 0;

    const lastTransactional =
      await this.transactionHistoryRepository.getLastTransactional(id);

    const lastWithdrawals =
      await this.withdrawalsHistoryRepository.getLastWithdrawals(id);

    const lastRegisters = await this.userRepository.getLastRegister(id);

    return [
      progressPackage,
      balance,
      lastTransactional,
      lastWithdrawals,
      lastRegisters,
    ];
  }

  //metodo para actualizar la informacion del usuario
  async updateInformationUserService(
    id: string,
    updateInformationUserDto: UpdateInformationUserDto,
  ) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    const userUpdated =
      await this.userRepository.updateInformationUserRepository(
        id,
        updateInformationUserDto,
      );

    const sponsor = await this.userRepository.getUserByUUIDRepository(
      user.sponsor,
    );

    const userReturn = {
      name: userUpdated.name,
      email: userUpdated.email,
      sponsor: sponsor.credential.username,
      birthdate: userUpdated.birthdate,
      country: userUpdated.country,
      celphone: userUpdated.celphone,
      createdAt: userUpdated.createdAt,
      credential: {
        username: userUpdated.credential.username,
        profile: userUpdated.credential.profile,
        walletPublica: userUpdated.credential.walletPublica,
      },
    };

    return userReturn;
  }

  //metodo para buscar la informacion de los referidos de un usuario
  async getUserInformationReferredService(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    return this.userRepository.getUserInformationReferredService(id);
  }
}
