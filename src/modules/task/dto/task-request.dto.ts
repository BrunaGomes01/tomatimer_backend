import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TaskRequestDto {
  @ApiProperty({
    description: 'The name.',
    type: String,
    example: 'Lavar louça',
  })
  @IsNotEmpty({
    message: 'Por favor, digite um nome da sua task. Este campo é obrigatório.',
  })
  @IsString({
    message: 'O nome inserido não é válido. Utilize apenas letras e espaços.',
  })
  name: string;

  @ApiProperty({
    description: 'The userId.',
    type: Number,
    example: 1,
  })
  @IsNotEmpty({
    message: 'Por favor, passe o userid. Este campo é obrigatório.',
  })
  userId: number;
}
