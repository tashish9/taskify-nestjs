import {
  Controller,
  Dependencies,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Request } from 'express';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Team } from 'src/entities/teams.entity';

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

  @Post('/:id/update-task')
  async updateTask(@Req() req: Request): Promise<Team> {
    return this.teamsService.updateTask(req.params.id, req.body.taskData);
  }
}
