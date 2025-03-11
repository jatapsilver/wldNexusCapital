import { Injectable } from '@nestjs/common';
import { CreateSupportTicketDto } from './Dtos/createSupportTicket.dto';
import { SupportTickets } from 'src/entities/supportTickets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketsMessages } from 'src/entities/ticketMessages.entity';
import { User } from 'src/entities/user.entity';
import { StatusSupportTickets } from 'src/enums/supportTickets/statusSupportTickets';

@Injectable()
export class SupportTicketsRepository {
  constructor(
    @InjectRepository(SupportTickets)
    private readonly supportTicketsRepository: Repository<SupportTickets>,
    @InjectRepository(TicketsMessages)
    private readonly ticketsMessagesRepository: Repository<TicketsMessages>,
  ) {}
  //metodo para crear el ticket en la base de datos
  async postCreateSupportTicketRepository(
    user: User,
    createSupportTicketDto: CreateSupportTicketDto,
  ) {
    const ticket = this.supportTicketsRepository.create({
      subject: createSupportTicketDto.subject,
      user: user,
      status: StatusSupportTickets.OPEN,
    });

    const savedTicket = await this.supportTicketsRepository.save(ticket);

    const ticketMessage = this.ticketsMessagesRepository.create({
      message: createSupportTicketDto.message,
      sender: user,
      ticket: savedTicket,
    });

    await this.ticketsMessagesRepository.save(ticketMessage);
    return 'Ticket enviado a soporte';
  }
  //metodo para obtener los tickets de un usuario
  async getAllSupportTicketByUuidRepository(id: string) {
    return await this.supportTicketsRepository.find({
      where: { user: { uuid: id } },
      relations: ['ticketMessages'],
    });
  }

  //metodo para obtener un ticket por uuid
  async getSupportTicketByUuidRepository(ticket_id: string) {
    return await this.supportTicketsRepository.findOne({
      where: { uuid: ticket_id },
      relations: ['ticketMessages'],
    });
  }
  //metodo para enviar un nuevo mensaje a un ticket
  async postUpdateTicketMessageRepository(
    user: User,
    ticket: SupportTickets,
    message: string,
  ) {
    const ticketMessage = this.ticketsMessagesRepository.create({
      message: message,
      sender: user,
      ticket: ticket,
    });
    await this.ticketsMessagesRepository.save(ticketMessage);
    return 'Nuevo mensaje enviado al ticket';
  }
}
