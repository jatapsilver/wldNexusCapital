import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderStatus } from 'src/enums/orderStatus/orderStatus.enum';
import { In, Repository } from 'typeorm';
import { CreatePurchaseOrderDto } from './Dtos/createPurchaseOrderDto';
import { ProgressPackagesRepository } from 'src/progress-packages/progress-packages.repository';
import { Package } from 'src/entities/package.entity';
import { UserCompletedOrderDto } from './Dtos/userCompletedOrderDto';

@Injectable()
export class PurchaseOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly progressPackagesRepository: ProgressPackagesRepository,
  ) {}

  //metodo para traer una orden del usuario en estado new o upgrade por uuid
  async getOrderByUuidRepository(id: string) {
    return await this.orderRepository.find({
      where: {
        user: { uuid: id },
        status: In([OrderStatus.NEW, OrderStatus.UPGRADE]),
      },
      order: { purchaseDate: 'DESC' },
      relations: ['package'],
    });
  }

  //metodo para crear una nueva orden del usuario
  async postCreatePurchaseRepository(
    id: string,
    createPurchaseOrderDto: CreatePurchaseOrderDto,
    walletPrivate: string,
  ) {
    const packageData = await this.packageRepository.findOne({
      where: { uuid: createPurchaseOrderDto.packageID },
    });

    if (!packageData) {
      throw new Error('El paquete seleccionado no existe.');
    }
    const progressPackagesExisting =
      await this.progressPackagesRepository.getProgressPackageUserByUuid(id);
    let newOrder;
    if (progressPackagesExisting) {
      newOrder = this.orderRepository.create({
        user: { uuid: id },
        package: packageData,
        walletPrivate,
        status: OrderStatus.UPGRADE,
      });
    } else {
      newOrder = this.orderRepository.create({
        user: { uuid: id },
        package: packageData,
        walletPrivate,
        status: OrderStatus.NEW,
      });
    }

    await this.orderRepository.save(newOrder);

    return {
      message: progressPackagesExisting
        ? 'Orden de upgrade creada'
        : 'Orden de compra creada',
      order: newOrder,
    };
  }
  //metodo para cancelar la orden de un usuario por uuid
  async getCancelledPurchaseOrderRepository(id: string) {
    await this.orderRepository.update(
      {
        user: { uuid: id },
        status: In([OrderStatus.NEW, OrderStatus.UPGRADE]),
      },
      { status: OrderStatus.CANCELLED },
    );

    return { message: 'Órdenes canceladas exitosamente.' };
  }

  //metodo para traer los hashes de transacciones de un usuario por uuid
  async getUserHashTransactionsRepository(id: string) {
    return await this.orderRepository.find({
      where: { user: { uuid: id }, status: OrderStatus.COMPLETED },
    });
  }

  async updateStatusOrderFinally(
    uuid: string,
    userCompletedOrderDto: UserCompletedOrderDto,
  ) {
    return await this.orderRepository.update(
      { uuid: uuid },
      {
        status: OrderStatus.COMPLETED,
        transactionHash: userCompletedOrderDto.hash,
      },
    );
  }
}
