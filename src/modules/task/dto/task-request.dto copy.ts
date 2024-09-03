import { PartialType } from '@nestjs/mapped-types';
import { TaskRequestDto } from './task-request.dto';

export class TaskUpdateRequestDto extends PartialType(TaskRequestDto) {}
