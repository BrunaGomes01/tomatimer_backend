import { Injectable, Logger } from '@nestjs/common';
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
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(payload: UserRequestDto): Promise<User> {
    this.logger.log('Creatting user');

    try {
      const { email, password, name } = payload;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      const newUser = await this.usersRepository.save(user);

      delete newUser.password;

      return newUser;
    } catch (error) {
      this.logger.error(`Error creatting user: ${error}`);
      throw error;
    }
  }

  async findUserByEmail(
    email: string,
    selectSecrets: boolean = false,
  ): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        password: selectSecrets,
      },
    });
  }
}
