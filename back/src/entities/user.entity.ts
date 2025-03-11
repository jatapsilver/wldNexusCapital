import { StatusUser } from 'src/enums/statusUser/statusUser.enum';
import { Credential } from './credential.entity';
import { Order } from './order.entity';
import { PackageProgress } from './packageProgress.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordResetToken } from './passwordReset.entity';
import { TransactionHistory } from './transactionHistory.entity';
import { WithdrawalsHistory } from './withdrawalsHistory.entity';
import { SupportTickets } from './supportTickets.entity';
import { TicketsMessages } from './ticketMessages.entity';
import { DepositHistory } from './depositHistory.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos.',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description:
      'Nombre del usuario. debe ser un string no mayor a 50 caracteres',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description:
      'Correo electrónico del usuario. debe ser un string no mayor a 50 caracteres y debe ser único',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Debe ser un string de la fecha de nacimiento del usuario',
    example: '1992-02-05',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  birthdate: string;

  @ApiProperty({
    description:
      'Debe ser un string de país del usuario. Debe ser un string no mayor a 50 caracteres',
    example: 'United States',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @ApiProperty({
    description:
      'Debe ser un string de número de teléfono celular del usuario. Debe ser un string no mayor a 20 caracteres',
    example: '+57300 400 50 60',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  celphone: string;

  @ApiProperty({
    description:
      'Debe ser un string de fecha de creación del usuario. Debe ser un string de la fecha y hora',
    example: '2022-01-01 10:00:00',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description:
      'Debe ser un string de estado del usuario. Debe ser un string de uno de los valores definidos en el enum StatusUser',
    example: 'active',
  })
  @Column({ type: 'enum', enum: StatusUser, default: StatusUser.ACTIVE })
  status: StatusUser;

  @ApiProperty({
    description: 'Debe ser un uuid del usuario sponsor',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @Column({ type: 'uuid', nullable: false })
  sponsor: string;

  @ApiProperty({
    description: 'Debe ser una relacion entre user y credential',
  })
  @OneToOne(() => Credential, (credential) => credential.user, {
    cascade: true,
  })
  credential: Credential;

  @ApiProperty({
    description: 'Debe ser una relacion entre user y order',
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ApiProperty({
    description: 'Debe ser una relacion entre user y packageProgress',
  })
  @OneToMany(() => PackageProgress, (progress) => progress.user)
  packageProgresses: PackageProgress[];

  @ApiProperty({
    description: 'Debe ser una relacion entre user y passwordResetToken',
  })
  @OneToMany(() => PasswordResetToken, (token) => token.user, { cascade: true })
  passwordResetTokens: PasswordResetToken[];

  @ApiProperty({
    description: 'Transacciones asociadas a este usuario',
  })
  @OneToMany(() => TransactionHistory, (transaction) => transaction.user)
  transactions: TransactionHistory[];

  @ApiProperty({
    description: 'Retiros asociados a este usuario',
  })
  @OneToMany(() => WithdrawalsHistory, (withdrawal) => withdrawal.user)
  withdrawals: WithdrawalsHistory[];

  @ApiProperty({
    description: 'Tickets de soporte asociados al usuario',
  })
  @OneToMany(() => SupportTickets, (supportTicket) => supportTicket.user)
  supportTickets: SupportTickets[];

  @ApiProperty({
    description: 'Mensajes enviado por este usuario',
  })
  @OneToMany(() => TicketsMessages, (ticketMessage) => ticketMessage.sender)
  ticketMessages: TicketsMessages[];

  // Relación: Un usuario puede tener varios depósitos
  @ApiProperty({
    description: 'Historial de depósitos asociados al usuario',
  })
  @OneToMany(() => DepositHistory, (depositHistory) => depositHistory.user)
  depositHistories: DepositHistory[];
}
