import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class UpdatePasswordEmailDto {
  @ApiProperty({
    description:
      'Token generado al cambiar la contraseña debe estar en formato uuid',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsNotEmpty()
  token: string;

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
  newPassword: string;

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
  @Validate(MatchPassword, ['newPassword'])
  confirmNewPassword: string;
}
