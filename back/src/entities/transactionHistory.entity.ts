import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'transaction_history' })
export class TransactionHistory {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description:
      'Debe ser una relación entre usuario y su historial de transacciones',
  })
  @ManyToOne(() => User, (user) => user.transactions, { nullable: false })
  user: User;

  @ApiProperty({
    description: 'Debe ser una fecha en la que se realizó la transacción',
    example: '2025/02/08',
  })
  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @ApiProperty({
    description: 'Debe ser una descripción de la transacción',
    example: 'Compra de paquete',
  })
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ApiProperty({
    description: 'Debe ser el valor de la transacción',
    example: '100.00',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  @ApiProperty({
    description: 'Balance acumulado tras la transacción',
    example: '950.00',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  balance: number;
}
