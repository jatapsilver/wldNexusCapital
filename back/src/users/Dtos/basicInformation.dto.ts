import { ApiProperty } from '@nestjs/swagger';

export class BasicInformacionDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  uuid: string;
}
