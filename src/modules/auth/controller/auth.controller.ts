import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginReponseDto } from '../dto/login-response.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ChangePasswordRequestDto } from '../dto/change-password-request.dot';
import { ForgotPasswordRequestDto } from '../dto/forgot-password-request.dto';
import { ResetTokenRequestDto } from '../dto/reset-token-request.dto';
import { ForgotPasswordResponseDto } from '../dto/forgot-password-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { UserService } from '../../user/service/user.service';

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
    description: 'Refresh token user',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token user',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user token',
    type: String,
  })
  @Post('refresh')
  async refreshToken(
    @Headers('token') token: string,
    @Body() request: RefreshTokenRequestDto,
  ): Promise<string> {
    return await this.authService.refreshToken(request);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ description: 'Change password' })
  @ApiHeader({
    name: 'token',
    description: 'Token user',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The change password',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('change-password')
  async changePassword(
    @Headers('token') token: string,
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
  @ApiHeader({
    name: 'token',
    description: 'Token user',
  })
  @ApiBody({ type: ForgotPasswordRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Forgot password',
    type: ForgotPasswordResponseDto,
  })
  @Post('forgot-password')
  async forgotPassword(
    @Headers('token') token: string,
    @Body() forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ description: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The reset password',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token user',
  })
  @ApiBody({ type: ResetTokenRequestDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('reset-password')
  async resetPassword(
    @Headers('token') token: string,
    @Body() resetTokenRequestDto: ResetTokenRequestDto,
  ): Promise<void> {
    await this.authService.resetPassword(
      resetTokenRequestDto.newPassword,
      resetTokenRequestDto.resetToken,
    );
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    description: 'Get user',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the token user',
    type: UserResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('user')
  getProfile(
    @Headers('token') token: string,
    @Req() request,
  ): Promise<UserResponseDto> {
    return this.userService.getUser(request.userId);
  }
}
