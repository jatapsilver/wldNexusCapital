import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import { CreateSupportTicketDto } from './Dtos/createSupportTicket.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UpdateTicketMessageDto } from './Dtos/updateTicketMessage.dto';

@ApiTags('SupportTicketService')
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supportTicketService: SupportTicketsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Get('getSupportTicketByUUID/:id')
  getSupportTicketByUuid(@Param('id') id: string) {
    return this.supportTicketService.getSupportTicketByUuidServices(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Post('createSupportTicket/:id')
  postCreateSupportTicket(
    @Param('id') id: string,
    @Body() createSupportTicketDto: CreateSupportTicketDto,
  ) {
    return this.supportTicketService.postCreateSupportTicketService(
      id,
      createSupportTicketDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER, ProfileUser.ADMIN)
  @Post('updateTicketMessage/:id')
  postUpdateTicketMessage(
    @Param('id') id: string,
    @Body() updateTicketMessageDto: UpdateTicketMessageDto,
  ) {
    return this.supportTicketService.postUpdateTicketMessageService(
      id,
      updateTicketMessageDto,
    );
  }
}
