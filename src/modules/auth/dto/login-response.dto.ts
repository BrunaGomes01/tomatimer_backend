import { ApiProperty } from '@nestjs/swagger';

export class LoginReponseDto {
  @ApiProperty({
    description: 'The user token',
    type: String,
    example: 'sshfngpsjaal',
  })
  token: string;

  @ApiProperty({
    description: 'The refreshToken',
    type: String,
    example: 'sshfngpsjaal',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The user id',
    type: Number,
    example: 1,
  })
  userId?: number;
}
