import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { GuestUserToken } from '../../../core/decorators/guest-access-token.decorator';

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

  @ApiOperation({
    description: 'Get user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the token user',
    type: UserResponseDto,
  })
  @Get()
  async getProfile(@GuestUserToken() token: string): Promise<UserResponseDto> {
    return await this.userService.getUser(token);
  }
}
