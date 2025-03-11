import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './Dtos/createPurchaseOrderDto';
import { PurchaseOrderRepository } from './purchase-order.repository';
import { UsersRepository } from 'src/users/users.repository';
import { UserCompletedOrderDto } from './Dtos/userCompletedOrderDto';
import { DepositHistoryRepository } from 'src/deposit-history/deposit-history.repository';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import { TransactionHistoryRepository } from 'src/transaction-history/transaction-history.repository';
import { OrderStatus } from 'src/enums/orderStatus/orderStatus.enum';
import { ProgressPackagesRepository } from 'src/progress-packages/progress-packages.repository';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly usersRepository: UsersRepository,
    private readonly depositHistoryRepository: DepositHistoryRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly progressPackagesRepository: ProgressPackagesRepository,
  ) {}

  //servicio para crear una orden
  async postCreatePurchaseOrderService(
    id: string,
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    const user = await this.usersRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }

    const walletPrivate = user.credential.walletPrivada;

    const orderExisting =
      await this.purchaseOrderRepository.getOrderByUuidRepository(id);

    if (orderExisting.length > 0) {
      return {
        message: 'Tienes una orden en proceso',
        orderExisting,
      };
    }

    return await this.purchaseOrderRepository.postCreatePurchaseRepository(
      id,
      createPurchaseOrderDto,
      walletPrivate,
    );
  }

  //servicio para cancelar una orden por el uuid del usuario
  async getCancelledPurchaseOrderService(id: string) {
    const user = await this.usersRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    const orderExisting =
      await this.purchaseOrderRepository.getOrderByUuidRepository(id);

    if (orderExisting.length === 0) {
      throw new BadRequestException('No tienes ninguna orden en proceso');
    }

    return await this.purchaseOrderRepository.getCancelledPurchaseOrderRepository(
      id,
    );
  }

  //servicio para obtener los hash de transacciones de un usuario
  async getUserHashTransactionsService(id: string) {
    const user = await this.usersRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }

    return await this.purchaseOrderRepository.getUserHashTransactionsRepository(
      id,
    );
  }

  //servicio para completar la orden de un usuario
  async userCompletedOrderService(
    id: string,
    userCompletedOrderDto: UserCompletedOrderDto,
  ) {
    const user = await this.usersRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    const orderExisting =
      await this.purchaseOrderRepository.getOrderByUuidRepository(id);
    if (orderExisting.length === 0) {
      throw new BadRequestException('No tienes ninguna orden en proceso');
    }

    await this.depositHistoryRepository.createDepositHistory(
      id,
      userCompletedOrderDto,
      orderExisting,
    );

    const sponsorOne = await this.usersRepository.getUserByUUIDRepository(
      user.sponsor,
    );
    const packageBuy = orderExisting[0].package.price;
    const referred = user.credential.username;
    if (sponsorOne.credential.profile === ProfileUser.AMBASSADOR) {
      await this.transactionHistoryRepository.paidSponsorOneLevelAmbassador(
        sponsorOne,
        packageBuy,
        referred,
      );
    } else {
      await this.transactionHistoryRepository.paidSponsorOneLevel(
        sponsorOne,
        packageBuy,
        referred,
      );
    }
    //segundo sponsor
    const sponsorTwo = await this.usersRepository.getUserByUUIDRepository(
      sponsorOne.sponsor,
    );

    if (sponsorTwo.credential.profile === ProfileUser.AMBASSADOR) {
      await this.transactionHistoryRepository.paidSponsorTwoLevelAmbassador(
        sponsorTwo,
        packageBuy,
        referred,
      );
    } else {
      await this.transactionHistoryRepository.paidSponsorTwoLevel(
        sponsorTwo,
        packageBuy,
        referred,
      );
    }
    //Tercer Sponsor
    const sponsorThree = await this.usersRepository.getUserByUUIDRepository(
      sponsorTwo.sponsor,
    );

    if (sponsorThree.credential.profile === ProfileUser.AMBASSADOR) {
      await this.transactionHistoryRepository.paisSponsorThreeLevelAmbassador(
        sponsorThree,
        packageBuy,
        referred,
      );
    } else {
      await this.transactionHistoryRepository.paidSponsorThreeLevel(
        sponsorThree,
        packageBuy,
        referred,
      );
    }

    if (orderExisting[0].status === OrderStatus.UPGRADE) {
      await this.progressPackagesRepository.createProgressPackagesUpgrade(
        user,
        orderExisting[0],
      );
    } else {
      await this.progressPackagesRepository.createProgressPackagesNew(
        user,
        orderExisting[0],
      );
    }

    await this.purchaseOrderRepository.updateStatusOrderFinally(
      orderExisting[0].uuid,
      userCompletedOrderDto,
    );

    return {
      message: 'Orden completada exitosamente',
    };
  }
}
