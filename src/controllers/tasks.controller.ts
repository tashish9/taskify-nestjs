import {
  Controller,
  Dependencies,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { TasksService } from 'src/services/tasks.service';
import { Task } from 'src/entities/task.entity';

@Controller('api/tasks')
@Dependencies(TasksService)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @Put('/add')
  // async addTask(@Req() req: Request) {
  //   return this.tasksService.addTask(req.body);
  // }

  @Put('/:id/assign')
  async assignTask(@Req() req: Request) {
    return this.tasksService.assignTask(req.params.id, req.body);
  }

  @Put('/:id/update-task')
  async updateTask(@Req() req: Request): Promise<Task> {
    return this.tasksService.updateTask(req.params.id, req.body.taskData);
  }
}
