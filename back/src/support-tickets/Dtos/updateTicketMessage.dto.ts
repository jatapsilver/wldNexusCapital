import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTicketMessageDto {
  @ApiProperty({
    description: 'Debe ser el mensaje de actualizacion del ticket de soporte',
    example:
      'Estoy intentando cambiar mi correo electrónico. Por favor, ayuda.',
  })
  @IsNotEmpty({
    message: 'El mensaje del ticket de soporte es requerido',
  })
  @IsString({
    message:
      'El mensaje del ticket de soporte debe ser una cadena de caracteres',
  })
  @MinLength(10, {
    message:
      'El mensaje del ticket de soporte debe tener al menos diez caracteres',
  })
  @MaxLength(1000, {
    message:
      'El mensaje del ticket de soporte debe tener máximo 1000 caracteres',
  })
  message: string;

  @ApiProperty({
    description: 'Debe ser el uuid del ticket',
    example: '60c162d1 617857000 8796199',
  })
  @IsNotEmpty({
    message: 'El uuid del ticket es requerido',
  })
  @IsString({
    message: 'El uuid del ticket debe ser una cadena de caracteres',
  })
  ticket_id: string;
}
