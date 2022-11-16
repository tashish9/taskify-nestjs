import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Task } from 'src/entities/task.entity';
import { TasksService } from 'src/services/tasks.service';
import { TasksController } from 'src/controllers/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
