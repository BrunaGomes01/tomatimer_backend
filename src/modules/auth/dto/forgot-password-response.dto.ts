import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'The reset token.',
    type: String,
    example: 'gmsPOJDFNADLOFO',
  })
  @IsString()
  resetToken: string;
}
