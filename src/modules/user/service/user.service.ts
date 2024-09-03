import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { RefreshTokenReponseDto } from '../../auth/dto/refresh-token-response.dto';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createUser(payload: UserRequestDto): Promise<void> {
    this.logger.log('Creatting user');

    try {
      const { email, password, name } = payload;

      const userFound = await this.findUserByEmail(email, false);

      if (!userFound) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await this.createNewUser(email, name, hashedPassword);
      }
    } catch (error) {
      this.logger.error(`Error creatting user: ${error}`);
      throw error;
    }
  }

  private async findUserByEmail(
    email: string,
    selectSecrets: boolean = false,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        password: selectSecrets,
      },
    });

    if (user) {
      throw new UnprocessableEntityException(
        'O endereço de e-mail informado já está em uso. Por favor, tente outroGuest user not found',
      );
    }

    return false;
  }

  private async createNewUser(
    email: string,
    name: string,
    password: string,
  ): Promise<void> {
    try {
      const user = this.userRepository.create({
        email,
        name,
        password,
      });

      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error user was not created: ${error}`);
      throw error;
    }
  }

  async getUser(token: string): Promise<UserResponseDto> {
    try {
      const tokenFound = await this.findUserIdByToken(token);

      if (tokenFound) {
        const user = await this.userRepository.findOne({
          where: { id: Number(tokenFound.userId) },
          select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
          },
        });
        if (!user) {
          throw new UnprocessableEntityException('Usuário não encontrado.');
        }

        return user;
      }
    } catch (error) {
      this.logger.error(`Error user was not found: ${error}`);
      throw error;
    }
  }

  private async findUserIdByToken(
    token: string,
  ): Promise<RefreshTokenReponseDto> {
    const response: RefreshTokenReponseDto =
      await this.refreshTokenRepository.findOne({
        where: { token: token },
      });

    if (!response) {
      throw new NotFoundException('Token não encontrado');
    }

    return response;
  }
}
