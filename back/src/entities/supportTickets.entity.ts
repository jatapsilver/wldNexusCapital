import { ApiProperty } from '@nestjs/swagger';
import { StatusSupportTickets } from 'src/enums/supportTickets/statusSupportTickets';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TicketsMessages } from './ticketMessages.entity';

@Entity({ name: 'supportTickets' })
export class SupportTickets {
  @ApiProperty({
    description:
      'Debe ser un uuid del ticket autogenerado por la base de datos.',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser el asunto del mensaje',
    example: 'Solicitud de cambio de correo',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  subject: string;

  @ApiProperty({
    description: 'Debe ser el estado del ticket',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @Column({
    type: 'enum',
    enum: StatusSupportTickets,
    default: StatusSupportTickets.OPEN,
    nullable: false,
  })
  status: StatusSupportTickets;

  @ApiProperty({
    description: 'Debe ser la fecha en la que se creo el ticket',
    example: '2022-01-01T12:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relación con User
  @ApiProperty({
    description: 'El usuario que generó el ticket de soporte',
  })
  @ManyToOne(() => User, (user) => user.supportTickets, { nullable: false })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @ApiProperty({
    description: 'Mensajes asociados a este ticket',
  })
  @OneToMany(() => TicketsMessages, (ticketMessage) => ticketMessage.ticket)
  ticketMessages: TicketsMessages[];
}
