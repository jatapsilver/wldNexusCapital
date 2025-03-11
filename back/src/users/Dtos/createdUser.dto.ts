import { ApiProperty } from '@nestjs/swagger';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

export class CreatedUserDto {
  @ApiProperty({
    description: 'Debe ser un string de entre 8 y 50 caracteres',
    example: 'John Doe',
  })
  @IsNotEmpty({
    message: 'El nombre es requerido',
  })
  @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
  @MinLength(8, {
    message: 'El nombre debe tener al menos 8 caracteres',
  })
  @MaxLength(50, {
    message: 'El nombre debe tener máximo 50 caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name: string;

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

  @ApiProperty({
    description: 'Debe ser un string de entre 8 y 50 caracteres',
    example: 'johndoe123',
  })
  @IsNotEmpty({
    message: 'El sponsor es requerido',
  })
  @IsString({
    message: 'El sponsor debe ser una cadena de caracteres',
  })
  @MinLength(8, {
    message: 'El sponsor debe tener al menos 8 caracteres',
  })
  @MaxLength(50, {
    message: 'El sponsor debe tener máximo 50 caracteres',
  })
  sponsor: string;

  @ApiProperty({
    description: 'Debe ser un string de entre 8 y 50 caracteres',
    example: 'johndoe123',
  })
  @IsNotEmpty({
    message: 'El username es requerido',
  })
  @IsString({
    message: 'El username debe ser una cadena de caracteres',
  })
  @MinLength(8, {
    message: 'El username debe tener al menos 8 caracteres',
  })
  @MaxLength(50, {
    message: 'El username debe tener máximo 50 caracteres',
  })
  @Matches(/^[a-zA-Z0-9ñÑ]+$/, {
    message:
      'El username solo puede contener letras y números (sin espacios ni caracteres especiales)',
  })
  username: string;

  @ApiProperty({
    description:
      'Debe ser un string de entre 8 y 15 caracteres con al menos una mayuscula una  minuscula, un numero y un caracter especial',
    example: 'Password123*',
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de caracteres',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(15, {
    message: 'La contraseña debe tener máximo 15 caracteres',
  })
  @Matches(
    /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zñÑ\d@$!%*?&]{8,15}$/,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial',
    },
  )
  password: string;

  @ApiProperty({
    description:
      'Debe ser un string de entre 8 y 15 caracteres con al menos una mayuscula una  minuscula, un numero y un caracter especial',
    example: 'Password123*',
  })
  @IsNotEmpty({
    message: 'Confirmar contraseña es requerida',
  })
  @IsString({
    message: 'Confirmar contraseña debe ser una cadena de caracteres',
  })
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;
}
