import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'packages' })
export class Package {
  @ApiProperty({
    description: 'Debe ser una uuid autogenerado por la base de datos',
    example: 'a1b2c3-d4e5-f6g7-h8i9-j0k1l2m3n4o',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser un nombre único para el paquete',
    example: 'Paquete de prueba',
  })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Debe ser un número entero',
    example: 100,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Debe ser una relacion entre order y package',
  })
  @OneToMany(() => Order, (order) => order.package)
  orders: Order[];
}
