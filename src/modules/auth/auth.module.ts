import { Logger, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../user/entities/user.entity';
import { MailService } from './service/mail.service';
import { ResetToken } from './entities/reset-token.entity';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User, RefreshToken, ResetToken])],
  providers: [AuthService, Logger, JwtService, UserService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
