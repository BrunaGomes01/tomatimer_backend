import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

import { UserRequestDto } from '../dto/user-request.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
