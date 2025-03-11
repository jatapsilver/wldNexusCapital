import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'referral_payments' })
export class ReferralPayment {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser una relacion entre user y referralUser',
  })
  @ManyToOne(() => User, { nullable: false })
  referredUser: User;

  @ApiProperty({
    description: 'Debe ser una fecha de creación de los pagos de referidos',
  })
  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @ApiProperty({
    description: 'Debe ser un monto de pago de referidos',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;
}
