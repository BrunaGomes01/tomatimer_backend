import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The user id',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The user email',
    type: String,
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The user name',
    type: String,
    example: 'José Campos',
  })
  name: string;

  @ApiProperty({
    description: 'The user password',
    type: String,
    example: 'Abelha2024.',
  })
  password?: string;

  @ApiProperty({
    description: 'The user creation date',
    type: Date,
    example: '2024-07-24 19:53:23.000',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the user was last updated',
    type: Date,
    example: '2024-07-24 19:53:45.475',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The user status',
    type: Boolean,
    example: false,
  })
  isActive: boolean;
}
