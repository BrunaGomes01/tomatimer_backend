import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../../user/service/user.service';
import { LoginRequestDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginRequestDto) {
    const user = await this.userService.findUserByEmail(email, true);
    if (!user) {
      return null;
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }
    } catch (error) {
      this.logger.error(`Error find user: ${error}`);
      throw error;
    }

    delete user.password;

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
