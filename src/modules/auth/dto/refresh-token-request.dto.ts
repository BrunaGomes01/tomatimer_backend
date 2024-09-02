import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'The token.',
    type: String,
    example: 'gmsPOJDFNADLOFO',
  })
  @IsNotEmpty({
    message: 'Por favor, digite seu token. Este campo é obrigatório.',
  })
  @IsString()
  token: string;
}
