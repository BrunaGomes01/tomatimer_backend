import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginRequestDto } from '../dto/login-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { LoginReponseDto } from '../dto/login-response.dto';
import { TokenMapper } from '../mapper/token.mapper';
import { RefreshToken } from '../entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { RefreshTokenReponseDto } from '../dto/refresh-token-response.dto';

import { ResetToken } from '../entities/reset-token.entity';
import { nanoid } from 'nanoid';
import { ForgotPasswordResponseDto } from '../dto/forgot-password-response.dto';
import { ResetTokenReponseDto } from '../dto/reset-token-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
  ) {}

  async loginUser(credentials: LoginRequestDto): Promise<LoginReponseDto> {
    this.logger.log('Login user');

    try {
      const { email, password } = credentials;

      const userFound: UserResponseDto = await this.findUserByEmail(
        email,
        true,
      );

      if (userFound) {
        const validatedUser = await this.validateUser(
          password,
          userFound.password,
        );

        if (validatedUser) {
          const token = await this.generateUserTokens(userFound.id);
          return token;
        }
      }
    } catch (error) {
      this.logger.error(`Error login user: ${error}`);
      throw error;
    }
  }

  async refreshToken(payload: RefreshTokenRequestDto): Promise<string> {
    this.logger.log('Refresh token user');

    try {
      const tokenFound: RefreshTokenReponseDto =
        await this.findRefreshTokenByToken(payload.token);

      if (tokenFound) {
        const newToken = await this.generateUserTokens(tokenFound.userId);
        await this.deleteRefreshTokenById(tokenFound.id);
        return newToken.refreshToken;
      }
    } catch (error) {
      this.logger.error(`Error token user: ${error}`);
      throw error;
    }
  }

  private async findRefreshTokenByToken(
    token: string,
  ): Promise<RefreshTokenReponseDto> {
    const response = await this.refreshTokenRepository.findOne({
      where: { token: token, expiryDate: MoreThanOrEqual(new Date()) },
    });

    if (!response) {
      throw new NotFoundException('Token não encontrado');
    }

    return response;
  }

  private async findResetTokenByToken(
    token: string,
  ): Promise<ResetTokenReponseDto> {
    const response = await this.resetTokenRepository.findOne({
      where: { token: token, expiryDate: MoreThanOrEqual(new Date()) },
    });

    if (!response) {
      throw new NotFoundException('Token não encontrado');
    }

    return response;
  }

  private async deleteRefreshTokenById(id: number): Promise<void> {
    try {
      await this.refreshTokenRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error delete token user: ${error}`);
      throw error;
    }
  }

  private async deleteResetTokenById(id: number): Promise<void> {
    try {
      await this.resetTokenRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error delete reset token: ${error}`);
      throw error;
    }
  }

  private async findUserByEmail(
    email: string,
    selectSecrets: boolean = false,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        password: selectSecrets,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  private async findUserById(
    userId: number,
    selectSecrets: boolean = false,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        password: selectSecrets,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  private async validateUser(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, userPassword);
    if (!isMatch) {
      throw new UnauthorizedException(
        'A senha informada não está correta. Tente novamente.',
      );
    }

    return isMatch;
  }

  async generateUserTokens(userId: number): Promise<LoginReponseDto> {
    const userIdString = userId.toString();
    const token = this.jwtService.sign(
      { userIdString },
      { secret: 'super_secret' },
    );
    const refreshToken = uuidv4();

    await this.storeRefreshToken(token, userId);

    await this.userRepository.update(
      { id: userId },
      {
        isActive: true,
        updatedAt: new Date(),
      },
    );
    return TokenMapper.toDto(token, refreshToken);
  }

  private async storeRefreshToken(
    token: string,
    userId: number,
  ): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiryDate,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  async changePassword(
    userId,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const userFound = await this.findUserById(userId, true);

      if (userFound) {
        const validatedUser = await this.validateUser(
          oldPassword,
          userFound.password,
        );

        if (validatedUser) {
          const newHashedPassword = await bcrypt.hash(newPassword, 10);
          await this.userRepository.update(
            { id: userId },
            {
              password: newHashedPassword,
              updatedAt: new Date(),
            },
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error change password user: ${error}`);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
    try {
      const userFound: UserResponseDto = await this.findUserByEmail(
        email,
        true,
      );

      if (userFound) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const resetToken = nanoid(64);
        const newResetToken = this.resetTokenRepository.create({
          token: resetToken,
          userId: userFound.id,
          expiryDate,
        });
        await this.resetTokenRepository.save(newResetToken);

        return {
          resetToken: resetToken,
        } as ForgotPasswordResponseDto;
      }
    } catch (error) {
      this.logger.error(`Error delete token user: ${error}`);
      throw error;
    }
  }

  async resetPassword(newPassword: string, resetToken: string): Promise<void> {
    const tokenFound = await this.findResetTokenByToken(resetToken);

    if (tokenFound) {
      const userFound = await this.findUserById(tokenFound.userId);

      if (userFound) {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(
          { id: userFound.id },
          {
            password: newHashedPassword,
            updatedAt: new Date(),
          },
        );
        await this.deleteResetTokenById(tokenFound.id);
      }
    }
  }
}
