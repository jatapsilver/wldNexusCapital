import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserWithdrawalsDto {
  @ApiProperty({
    description: 'Debe ser la descripción de la transacción',
  })
  @IsNotEmpty({
    message: 'La descripción es requerida',
  })
  @IsString({
    message: 'La descripción debe ser una cadena de caracteres',
  })
  @MaxLength(50, {
    message: 'La descripción debe tener máximo 50 caracteres',
  })
  description: string;

  @ApiProperty({
    description: 'Debe ser el valor de la transacción (negativo)',
    example: -100.0,
  })
  @IsNotEmpty({
    message: 'El valor es requerido',
  })
  @Matches(/^-\d+(\.\d{1,2})?$/, {
    message:
      'El valor debe ser un número decimal negativo con hasta dos decimales',
  })
  value: string;
}
