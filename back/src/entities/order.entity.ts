import { User } from './user.entity';
import { Package } from './package.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PackageProgress } from './packageProgress.entity';
import { OrderStatus } from 'src/enums/orderStatus/orderStatus.enum';

@Entity({ name: 'orders' })
export class Order {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos.',
    example: '67890ab-cdef12345-67890abc-def12345678',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser una relacion entre user y orders',
  })
  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user: User;

  @ApiProperty({
    description: 'Debe ser una relacion entre package y orders',
  })
  @ManyToOne(() => Package, (packageItem) => packageItem.orders, {
    nullable: false,
  })
  package: Package;

  @ApiProperty({
    description: 'Debe ser una fecha de creacion',
    example: '2022-01-01T12:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  purchaseDate: Date;

  @ApiProperty({
    description: 'Debe ser la billetera privada del usuario',
  })
  @Column({
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  walletPrivate: string;

  @ApiProperty({
    description: 'Debe ser el status inicial de la orden',
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Debe ser un hash de transaccion ',
    example:
      '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  transactionHash: string;

  @OneToOne(() => PackageProgress, (packageProgress) => packageProgress.order)
  packageProgress: PackageProgress;
}
