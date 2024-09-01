import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginRequestDto {
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

  @ApiProperty({
    description: 'The password',
    type: String,
  })
  @IsNotEmpty({
    message: 'Por favor, digite uma senha. Este campo é obrigatório.',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    },
  )
  password: string;
}
