import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PasswordResetToken {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos.',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    description: 'Debe ser una relacion entre user y passwordResetTokens',
  })
  @ManyToOne(() => User, (user) => user.passwordResetTokens, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({
    description: 'Debe ser un token de recuperación de contraseña',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @Column({ unique: true })
  token: string;

  @ApiProperty({
    description: 'Debe ser una fecha y hora en la que se crea el token',
    example: '2022-12-31T23:59:59.999Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Debe ser una fecha y hora en la que el token expira',
    example: '2023-12-31T23:59:59.999Z',
  })
  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
