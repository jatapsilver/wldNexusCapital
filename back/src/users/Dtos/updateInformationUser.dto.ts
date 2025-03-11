import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  Validate,
  IsString,
  MinLength,
  MaxLength,
  IsEthereumAddress,
  IsNotEmpty,
} from 'class-validator';
import { MinAge } from 'src/validators/min-age.validator';

export class UpdateInformationUserDto {
  @ApiProperty({
    description: 'Debe ser la fecha de nacimiento del usuario',
    example: '1992-02-25',
  })
  @IsDateString(
    { strict: true },
    { message: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD' },
  )
  @Validate(MinAge, [18], { message: 'El usuario debe tener al menos 18 años' })
  @IsNotEmpty({
    message: 'La fecha de nacimiento es requerida',
  })
  birthdate: string;

  @ApiProperty({
    description: 'Debe ser el país del usuario',
    example: 'España',
  })
  @IsNotEmpty({
    message: 'El país es requerido',
  })
  @IsString({ message: 'El país debe ser un texto válido' })
  @MinLength(3, { message: 'El país debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El país no puede tener más de 50 caracteres' })
  country: string;

  @ApiProperty({
    description: 'Debe ser el número de celular del usuario',
    example: '(+34)666777888',
  })
  @IsNotEmpty({
    message: 'El número de celular es requerido',
  })
  celphone: string;

  @ApiProperty({
    description: 'Debe ser la dirección de una billetera',
    example: '0x2427023e53adcf898e93855ba3b13251ad1087b2',
  })
  @IsEthereumAddress({
    message: 'Debe ser una dirección de billetera EVM válida',
  })
  @IsNotEmpty({
    message: 'La dirección de billetera es requerida',
  })
  walletPublica: string;
}
