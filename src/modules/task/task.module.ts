import { Logger, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

import { TaskService } from './service/task.service';
import { TaskController } from './controller/task.controller';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, RefreshToken])],
  providers: [TaskService, Logger],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
