import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WithdrawalStatus } from '../enums/withdrawalStatus/withdrawalStatus.enum';
import { User } from './user.entity';

@Entity({ name: 'withdrawals_history' })
export class WithdrawalsHistory {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos ',
    example: '456789ab-cdef12345-67890abc-def12345678',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Usuario que realizó el retiro',
  })
  @ManyToOne(() => User, (user) => user.withdrawals, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({
    description: 'Fecha en la que se creó la solicitud',
    example: '2024-02-11T12:34:56Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Valor del retiro en usdt',
    example: 100.5,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Dirección de la wallet donde se hará el retiro',
    example: '0xAbC123456789DefABC123456789DefABC1234',
  })
  @Column({ type: 'varchar', length: 255 })
  walletAddress: string;

  @ApiProperty({
    description: 'Estado del retiro (processing o completed)',
    example: WithdrawalStatus.PROCESSING,
  })
  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PROCESSING,
  })
  status: WithdrawalStatus;

  @ApiProperty({
    description: 'Hash de la transacción en la blockchain',
    example:
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionHash?: string;

  @ApiProperty({
    description: 'Fecha de finalización del retiro',
    example: '2024-02-12T10:00:00Z',
  })
  @UpdateDateColumn()
  completedAt?: Date;
}
