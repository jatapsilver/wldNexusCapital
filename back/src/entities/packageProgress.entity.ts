import { User } from './user.entity';
import { PackageProgressStatus } from 'src/enums/packageProgress/packageProgress.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity({ name: 'package_progress' })
export class PackageProgress {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos ',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser una relacion entre user y packageProgresses',
  })
  @ManyToOne(() => User, (user) => user.packageProgresses, { nullable: false })
  user: User;

  @ApiProperty({
    description: 'Debe ser una fecha de creacion',
    example: '2022-01-01T15:30:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  startDate: Date;

  @ApiProperty({
    description:
      'Balance inicial (progreso acumulado). Inicia en 0 y se irá actualizando.',
    example: '100.00',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  initialValue: number;

  @ApiProperty({
    description:
      'Balance objetivo (valor final). Por defecto es el doble del paquete inicial, y en caso de upgrade se suma lo faltante del paquete anterior.',
    example: '200.00',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  finalValue: number;

  @ApiProperty({
    description:
      'Porcentaje de avance, calculado como (progress / finalValue) * 100',
    example: '50.00',
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentage: number;

  @ApiProperty({
    description: 'Fecha de finalización del progreso del paquete',
    example: '2022-02-01T15:30:00.000Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @ApiProperty({
    description: 'Estado del progreso del paquete',
    enum: PackageProgressStatus,
  })
  @Column({
    type: 'enum',
    enum: PackageProgressStatus,
    default: PackageProgressStatus.IN_PROGRESS,
  })
  status: PackageProgressStatus;

  @ApiProperty({
    description: 'Relación directa con la Order asociada al paquete',
  })
  @OneToOne(() => Order, { nullable: false })
  @JoinColumn()
  order: Order;
}
