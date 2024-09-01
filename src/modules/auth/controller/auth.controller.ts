import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserRequestDto } from '../../user/dto/user-request.dto';
import { UserService } from '../../user/service/user.service';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Express.Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: UserRequestDto) {
    const user = await this.userService.createUser(body);
    return user;
  }
}
