import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskRequestDto } from '../dto/task-request.dto';
import { TaskUpdateRequestDto } from '../dto/task-request.dto copy';
import { TaskResponseDto } from '../dto/task-response.dto';
import { TaskService } from '../service/task.service';
import { GuestUserToken } from '../../../core/decorators/guest-access-token.decorator';

@Controller('task')
@ApiTags('Tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({
    description: 'Create new task',
  })
  @ApiBody({ type: TaskRequestDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The task was created',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async createTask(
    @GuestUserToken() token: string,
    @Body() request: TaskRequestDto,
  ): Promise<void> {
    return await this.taskService.createTask(request, token);
  }

  @ApiOperation({
    description: 'Delete a task',
  })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'Task id',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The task was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTask(
    @GuestUserToken() token: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.taskService.deleteTask(id);
  }

  @ApiOperation({
    description: 'Update a task',
  })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'Task id',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The task was updated',
  })
  @ApiBody({ type: TaskUpdateRequestDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async updateTask(
    @GuestUserToken() token: string,
    @Param('id') id: string,
    @Body() request: TaskUpdateRequestDto,
  ): Promise<void> {
    await this.taskService.updateTask(id, request);
  }

  @ApiOperation({
    description: 'Returns all tasks by user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all tasks by user',
    type: [TaskResponseDto],
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get(':userId')
  async findAllTasksByUser(
    @GuestUserToken() token: string,
  ): Promise<TaskResponseDto[]> {
    return await this.taskService.findAllTasksByUser(token);
  }

  @ApiOperation({
    description: 'Returns a task',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a task',
    type: TaskResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get(':id')
  async findOneTask(
    @GuestUserToken() token: string,
    @Param('id') id: string,
  ): Promise<TaskResponseDto> {
    return await this.taskService.findOneTask(id);
  }

  @ApiOperation({
    description: 'Complete a task',
  })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'Task id',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The task was completed',
  })
  @ApiBody({ type: TaskUpdateRequestDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async completeTask(
    @GuestUserToken() token: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.taskService.completeTask(id);
  }
}
