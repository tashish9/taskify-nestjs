import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../services/app.service';
import CONSTANTS from 'config/constants';
import { Team } from '../entities/teams.entity';
import { TeamsModule } from './teams.module';
import { UsersModule } from './users.module';
import { User } from 'src/entities/user.entity';
import { Task } from 'src/entities/task.entity';
import { TasksModule } from './tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: CONSTANTS.MONGO_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: true,
      logging: true,
      entities: [Team, User, Task],
      migrations: [],
      subscribers: [],
    }),
    TeamsModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
