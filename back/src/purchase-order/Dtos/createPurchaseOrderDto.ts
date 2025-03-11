import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePurchaseOrderDto {
  @ApiProperty({
    description: 'Debe ser el uuid del paquete a adquirir',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsNotEmpty({
    message: 'El uuid del paquete es requerido',
  })
  @IsString({
    message: 'El uuid del paquete debe ser una cadena de caracteres',
  })
  packageID: string;
}
