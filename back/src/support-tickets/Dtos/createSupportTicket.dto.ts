import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSupportTicketDto {
  @ApiProperty({
    description: 'Debe ser el asunto del mensaje',
    example: 'Solicitud de cambio de correo',
  })
  @IsNotEmpty({
    message: 'el asunto del mensaje es requerido',
  })
  @IsString({
    message: 'el asunto debe ser una cadena de caracteres',
  })
  @MinLength(3, {
    message: 'El asunto debe tener al menos tres caracteres',
  })
  @MaxLength(50, {
    message: 'El asunto debe tener maximo 50 caracteres',
  })
  subject: string;

  @ApiProperty({
    description: 'Debe ser el mensaje del ticket de soporte',
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
}
