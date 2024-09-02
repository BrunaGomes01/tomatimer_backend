import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenReponseDto {
  @ApiProperty({
    description: 'The user token id',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The user token',
    type: String,
    example: 'sshfngpsjaal',
  })
  token: string;

  @ApiProperty({
    description: 'The user id',
    type: Number,
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'The expiry date',
    type: Date,
    example: '2024-07-24 19:53:23.000',
  })
  expiryDate: Date;

  @ApiProperty({
    description: 'The token creation date',
    type: Date,
    example: '2024-07-24 19:53:23.000',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the token was last updated',
    type: Date,
    example: '2024-07-24 19:53:45.475',
  })
  updatedAt: Date;
}
