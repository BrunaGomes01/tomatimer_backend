import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetTokenRequestDto {
  @ApiProperty({
    description: 'The reset token.',
    type: String,
    example: 'gmsPOJDFNADLOFO',
  })
  @IsNotEmpty({
    message: 'Por favor, digite seu reset token. Este campo é obrigatório.',
  })
  @IsString()
  resetToken: string;

  @ApiProperty({
    description: 'The new password',
    type: String,
  })
  @IsNotEmpty({
    message: 'Por favor, digite uma nova senha. Este campo é obrigatório.',
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
  newPassword: string;
}
