import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // only runs if the token is valid and successfully verified.
    // If the token is valid, the validate method is called with the decoded payload.

    // Optionally, you can perform additional checks here, such as checking if
    // the user exists, is banned, whatever.
    const user = await this.userService.findUserByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isActive !== true) {
      throw new UnauthorizedException(
        `${user.email}, account ${user.isActive}`,
      );
    }

    return { id: payload.sub, email: payload.email };
  }
}
