import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({
    description: 'The user id',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The taks name',
    type: String,
    example: 'Lavar louça',
  })
  name: string;

  @ApiProperty({
    description: 'The user email',
    type: String,
    example: 'example@gmail.com',
  })
  userId: number;

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
    description: 'The task status',
    type: Boolean,
    example: false,
  })
  isActive: boolean;
}
