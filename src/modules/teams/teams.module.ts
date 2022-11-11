import { Module } from '@nestjs/common';
// import { AuthModule } from 'src/modules/auth/auth.module';
// import { AuthService } from 'src/modules/auth/auth.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './teams.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
