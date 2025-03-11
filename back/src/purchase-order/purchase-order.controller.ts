import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import { CreatePurchaseOrderDto } from './Dtos/createPurchaseOrderDto';
import { UserCompletedOrderDto } from './Dtos/userCompletedOrderDto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Post('createPurchaseOrder/:id')
  postCreatePurchaseOrder(
    @Param('id') id: string,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.postCreatePurchaseOrderService(
      id,
      createPurchaseOrderDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Get('cancelledPurchaseOrder/:id')
  getCancelledPurchaseOrder(@Param('id') id: string) {
    return this.purchaseOrderService.getCancelledPurchaseOrderService(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Get('userHashTransactions/:id')
  getUserHashTransactions(@Param('id') id: string) {
    return this.purchaseOrderService.getUserHashTransactionsService(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Put('userCompletedOrder/:id')
  userCompletedOrder(
    @Param('id') id: string,
    @Body() userCompletedOrderDto: UserCompletedOrderDto,
  ) {
    return this.purchaseOrderService.userCompletedOrderService(
      id,
      userCompletedOrderDto,
    );
  }
}
