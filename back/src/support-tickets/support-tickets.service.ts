import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SupportTicketsRepository } from './support-tickets.repository';
import { CreateSupportTicketDto } from './Dtos/createSupportTicket.dto';
import { UsersRepository } from 'src/users/users.repository';
import { UpdateTicketMessageDto } from './Dtos/updateTicketMessage.dto';
import { StatusSupportTickets } from 'src/enums/supportTickets/statusSupportTickets';

@Injectable()
export class SupportTicketsService {
  constructor(
    private readonly supportTicketRepository: SupportTicketsRepository,
    private readonly userRepository: UsersRepository,
  ) {}
  //servicio para crear un ticket
  async postCreateSupportTicketService(
    id: string,
    createSupportTicketDto: CreateSupportTicketDto,
  ) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }

    return this.supportTicketRepository.postCreateSupportTicketRepository(
      user,
      createSupportTicketDto,
    );
  }

  //servicio para obtener los tickets de un usuario
  async getSupportTicketByUuidServices(id: string) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }
    return this.supportTicketRepository.getAllSupportTicketByUuidRepository(id);
  }

  //servicio para actualizar un mensaje en un ticket
  async postUpdateTicketMessageService(
    id: string,
    updateTicketMessageDto: UpdateTicketMessageDto,
  ) {
    const user = await this.userRepository.getUserByUUIDRepository(id);
    if (!user) {
      throw new BadRequestException('usuario no encontrado');
    }

    const ticket =
      await this.supportTicketRepository.getSupportTicketByUuidRepository(
        updateTicketMessageDto.ticket_id,
      );
    if (!ticket) {
      throw new BadRequestException('Ticket no encontrado');
    }
    if (ticket.status === StatusSupportTickets.CLOSED) {
      throw new ConflictException('El ticket ya se encuentra cerrado');
    }

    return this.supportTicketRepository.postUpdateTicketMessageRepository(
      user,
      ticket,
      updateTicketMessageDto.message,
    );
  }
}
