import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRequestDto } from '../../user/dto/user-request.dto';
import { UserService } from '../../user/service/user.service';
import { AuthService } from '../service/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginReponseDto } from '../dto/login-response.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ChangePasswordRequestDto } from '../dto/change-password-request.dot';
import { ForgotPasswordRequestDto } from '../dto/forgot-password-request.dto';
import { ResetTokenRequestDto } from '../dto/reset-token-request.dto';
import { ForgotPasswordResponseDto } from '../dto/forgot-password-response.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({
    description: 'Login user',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user token',
    type: LoginReponseDto,
  })
  @Post('login')
  async loginUser(@Body() request: LoginRequestDto): Promise<LoginReponseDto> {
    return await this.authService.loginUser(request);
  }

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
    description: 'Refresh token user',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user token',
    type: String,
  })
  @Post('refresh')
  async refreshToken(@Body() request: RefreshTokenRequestDto): Promise<string> {
    return await this.authService.refreshToken(request);
  }

  @ApiOperation({
    description: 'Returns the token user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the token user',
    type: LoginReponseDto,
  })
  @Get('token/:userId')
  async getTokenUser(
    @Param('userId') userId: number,
  ): Promise<LoginReponseDto> {
    return await this.authService.generateUserTokens(userId);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ description: 'Change password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The change password',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordRequestDto,
    @Req() req,
  ): Promise<void> {
    await this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @ApiOperation({
    description: 'Forgot password',
  })
  @ApiBody({ type: ForgotPasswordRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Forgot password',
    type: ForgotPasswordResponseDto,
  })
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ description: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The reset password',
  })
  @ApiBody({ type: ResetTokenRequestDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('reset-password')
  async resetPassword(
    @Body() resetTokenRequestDto: ResetTokenRequestDto,
  ): Promise<void> {
    await this.authService.resetPassword(
      resetTokenRequestDto.newPassword,
      resetTokenRequestDto.resetToken,
    );
  }
}
