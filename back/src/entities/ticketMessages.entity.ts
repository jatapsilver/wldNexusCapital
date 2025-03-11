import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupportTickets } from './supportTickets.entity';
import { User } from './user.entity';

@Entity({ name: 'ticketMessages' })
export class TicketsMessages {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos',
    example: '67890ab-cdef12345-67890abc-def12345678',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser el contenido del mensaje',
    example: 'Hola, necesito cambiar mi correo electrónico a 123@example.com',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  message: string;

  // Relación con SupportTickets (ticket al que pertenece el mensaje)
  @ApiProperty({
    description: 'Relación con el ticket al que pertenece este mensaje',
  })
  @ManyToOne(() => SupportTickets, (ticket) => ticket.ticketMessages, {
    nullable: false,
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: SupportTickets;

  // Relación con User (usuario o agente que envió el mensaje)
  @ApiProperty({
    description: 'Relación con el usuario que envió el mensaje',
  })
  @ManyToOne(() => User, (user) => user.ticketMessages, { nullable: false })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
