import { ApiProperty } from '@nestjs/swagger';
import { DepositStatus } from 'src/enums/depositStatus/depositStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'deposit_history' })
export class DepositHistory {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description:
      'Debe ser la fecha y hora de creación del historial de depósito',
    example: '2022-01-01T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Debe ser el identificador de la billetera del usuario',
    example: '0x123e4567e89b12d3a456426655440000',
  })
  @Column({
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  walletDeposit: string;

  @ApiProperty({
    description: 'Debe ser el valor del depósito',
    example: '1000.00',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  valueDeposit: number;

  @ApiProperty({
    description: 'Debe ser el hash del deposito',
    example: '0x123456789abcdef0123456789abcdef0123456789abcdef',
  })
  @Column({
    type: 'varchar',
    length: '255',
    nullable: false,
    unique: true,
  })
  hashDeposit: string;

  @ApiProperty({
    description: 'Debe ser el hash del retiro',
    example: '0x123456789abcdef0123456789abcdef0123456789abcdef',
  })
  @Column({
    type: 'varchar',
    length: '255',
    nullable: true,
    unique: true,
  })
  hashWithdrawals: string;

  @Column({
    type: 'enum',
    enum: DepositStatus,
    default: DepositStatus.PROCESSING,
  })
  status: DepositStatus;

  // Relación: Cada depósito pertenece a un solo usuario
  @ManyToOne(() => User, (user) => user.depositHistories, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
