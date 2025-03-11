import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({
  name: 'credentials',
})
export class Credential {
  @ApiProperty({
    description: 'Debe ser un uuid autogenerado por la base de datos',
    example: '895935a6-d737-4b9f-8885-d9f8d8f574b8',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ description: 'Relacion con la entidad User' })
  @OneToOne(() => User, (user) => user.credential)
  @JoinColumn()
  user: User;

  @ApiProperty({
    description: 'Debe ser un string de maximo 50 caracteres',
    example: 'testUsers',
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @ApiProperty({
    description: 'Debe ser una cadena de maximo 128 caracteres',
    example: 'password123',
  })
  @Column({ type: 'varchar', length: 128, nullable: false })
  password: string;

  @ApiProperty({
    description: 'Debe ser un enum con valores de ProfileUser',
    example: 'user',
  })
  @Column({ type: 'enum', enum: ProfileUser })
  profile: ProfileUser;

  @ApiProperty({
    description: 'Debe ser un string de maximo 255 caracteres',
    example: '0x895935a6d7374b9f8885d9f8d8f574b8',
  })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  walletPrivada: string;

  @ApiProperty({
    description: 'Debe ser un string de maximo 255 caracteres',
    example: '0x895935a6d7374b9f8885d9f8d8f574b8',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  walletPublica: string;

  @ApiProperty({
    description: 'Debe ser un string de maximo 255 caracteres',
    example: '123456789abcdef0123456789abcdef0123456789abcdef',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  privateKey: string;
}
