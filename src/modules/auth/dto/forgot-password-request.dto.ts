import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    description: 'The email.',
    type: String,
    example: 'userexample@gmail.com',
  })
  @IsNotEmpty({
    message: 'Por favor, digite seu email. Este campo é obrigatório.',
  })
  @IsEmail(
    {},
    {
      message:
        'O formato do e-mail está incorreto. Certifique-se de que ele contém um `@` e um domínio válido (exemplo@email.com).',
    },
  )
  email: string;
}
