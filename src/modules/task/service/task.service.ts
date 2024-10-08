import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TaskRequestDto } from '../dto/task-request.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { User } from '../../user/entities/user.entity';
import { TaskUpdateRequestDto } from '../dto/task-request.dto copy';
import { TaskResponseDto } from '../dto/task-response.dto';
import { RefreshTokenReponseDto } from '../../auth/dto/refresh-token-response.dto';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createTask(payload: TaskRequestDto, token: string): Promise<void> {
    this.logger.log('Creatting task');

    try {
      const { name } = payload;

      const userFound = await this.getUser(token);

      if (userFound) {
        await this.createNewTask(name, userFound.id);
      }
    } catch (error) {
      this.logger.error(`Error creatting task: ${error}`);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.logger.log('Deleting task');

    try {
      const taskFound = await this.findTaskById(id);

      if (taskFound) {
        await this.taskRepository.delete({
          id: Number(id),
        });
      }
    } catch (error) {
      this.logger.error(`Error deleting task: ${error}`);
      throw error;
    }
  }

  async updateTask(id: string, request: TaskUpdateRequestDto): Promise<void> {
    this.logger.log('Updating task');

    try {
      const taskFound = await this.findTaskById(id);

      if (taskFound) {
        await this.taskRepository.update(
          { id: Number(id) },
          {
            name: request.name,
            updatedAt: new Date(),
          },
        );
      }
    } catch (error) {
      this.logger.error(`Error updatting task: ${error}`);
      throw error;
    }
  }

  async findAllTasksByUser(token: string): Promise<TaskResponseDto[]> {
    this.logger.log('Getting all tasks by user');

    try {
      const userFound = await this.getUser(token);

      if (userFound) {
        const taksByUser: TaskResponseDto[] = await this.taskRepository.find({
          where: {
            userId: Number(userFound.id),
          },
        });

        return taksByUser;
      }
    } catch (error) {
      this.logger.error(`Error getting tasks: ${error}`);
      throw error;
    }
  }

  async findOneTask(id: string): Promise<TaskResponseDto> {
    this.logger.log('Getting all tasks by user');

    try {
      const taskFound = await this.findTaskById(id);

      if (taskFound) {
        return taskFound;
      }
    } catch (error) {
      this.logger.error(`Error getting task: ${error}`);
      throw error;
    }
  }

  async completeTask(id: string): Promise<void> {
    this.logger.log('Completting task');

    try {
      const taskFound = await this.findTaskById(id);

      if (taskFound) {
        await this.taskRepository.update(
          { id: Number(id) },
          {
            isActive: false,
            updatedAt: new Date(),
          },
        );
      }
    } catch (error) {
      this.logger.error(`Error completting task: ${error}`);
      throw error;
    }
  }

  private async createNewTask(name: string, userId: number): Promise<void> {
    try {
      const task = this.taskRepository.create({
        userId,
        name,
      });

      await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(`Error task was not created: ${error}`);
      throw error;
    }
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

  private async findTaskById(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: Number(id) },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrado');
    }

    return task;
  }

  private async getUser(token: string): Promise<UserResponseDto> {
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
            createdAt: true,
            updatedAt: true,
          },
        });
        if (!user) {
          throw new UnprocessableEntityException('Usuário não encontrado.');
        }

        return user as UserResponseDto;
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
