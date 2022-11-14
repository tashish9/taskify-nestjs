import { Module } from '@nestjs/common';
import { TeamsController } from '../controllers/teams.controller';
import { TeamsService } from '../services/teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../entities/teams.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, User])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
