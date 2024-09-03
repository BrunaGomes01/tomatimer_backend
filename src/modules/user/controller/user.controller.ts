import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from '../dto/user-request.dto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    description: 'Create new user',
  })
  @ApiBody({ type: UserRequestDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The user was created',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('register')
  async createUser(@Body() request: UserRequestDto): Promise<void> {
    return await this.userService.createUser(request);
  }
}
