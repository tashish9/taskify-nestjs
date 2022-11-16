import {
  Controller,
  Dependencies,
  Get,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Team } from 'src/entities/teams.entity';
import { Task } from 'src/entities/task.entity';

@Controller('api/teams')
@Dependencies(TeamsService)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('/')
  // @UseGuards(AuthGuard)
  async findAllTeams(): Promise<Team[]> {
    return this.teamsService.findAllTeams();
  }

  @Post('/add')
  // @UseGuards(AuthGuard)
  async addTeam(@Req() req: Request): Promise<Team> {
    return this.teamsService.addTeam(req.body);
  }

  @Get('/:id')
  async findTeam(@Req() req: Request): Promise<Team> {
    return this.teamsService.findTeam(req.params.id);
  }

  @Post('/:id/add-task')
  async addTask(@Req() req: Request): Promise<Team> {
    return this.teamsService.addTask(req.params.id, req.body);
  }

  @Put('/:id/update-task')
  async updateTask(@Req() req: Request): Promise<Team> {
    return this.teamsService.updateTask(req.params.id, req.body.taskData);
  }

  @Post('/:id/add-member')
  async addMember(@Req() req: Request): Promise<Team> {
    return this.teamsService.addMember(req.params.id, req.body);
  }

  @Get('/:id/users/:userId/tasks')
  getMemberTasks(@Req() req: Request): Promise<Task[]> {
    return this.teamsService.getMemberTasks(req.params.id, req.params.userId);
  }
}
