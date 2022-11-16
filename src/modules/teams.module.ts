import { Module } from '@nestjs/common';
import { TeamsController } from '../controllers/teams.controller';
import { TeamsService } from '../services/teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../entities/teams.entity';
import { User } from 'src/entities/user.entity';
import { Task } from 'src/entities/task.entity';
import { TasksService } from 'src/services/tasks.service';
import { TasksModule } from './tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team, User, Task]), TasksModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
