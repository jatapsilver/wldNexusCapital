import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Debe ser un string de entre 8 y 50 caracteres',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty({
    message: 'El email es requerido',
  })
  @IsString({
    message: 'El email debe ser una cadena de caracteres',
  })
  @MinLength(8, {
    message: 'El email debe tener al menos 8 caracteres',
  })
  @MaxLength(50, {
    message: 'El email debe tener máximo 50 caracteres',
  })
  @IsEmail(
    {},
    {
      message: 'El email no es válido',
    },
  )
  email: string;
}
