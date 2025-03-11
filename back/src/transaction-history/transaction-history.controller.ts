import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateUserWithdrawalsDto } from './Dtos/createUserWithdrawals.dto';

@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Get('createUserTrasictionHistory/:id')
  getUserTrasictionHistory(@Param('id') id: string) {
    return this.transactionHistoryService.getUserTrasictionHistoryService(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Post('createUserWithdrawal/:id')
  postCreateUserWithdrawal(
    @Param('id') id: string,
    @Body() createUserWithdrawalsDto: CreateUserWithdrawalsDto,
  ) {
    return this.transactionHistoryService.postCreateUserWithdrawalService(
      id,
      createUserWithdrawalsDto,
    );
  }
}
