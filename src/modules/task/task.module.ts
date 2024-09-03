import { Logger, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

import { TaskService } from './service/task.service';
import { UserService } from '../user/service/user.service';
import { TaskController } from './controller/task.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  providers: [TaskService, Logger, UserService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
