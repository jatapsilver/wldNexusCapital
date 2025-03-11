import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserCompletedOrderDto {
  @ApiProperty({
    description: 'Hash de la orden completada',
    example: '0x123e4567e89b12d3a456426655440000',
  })
  @IsNotEmpty({
    message: 'Hash de la orden completada es requerido',
  })
  @IsString({
    message: 'Hash de la orden completada debe ser una cadena de caracteres',
  })
  hash: string;
}
