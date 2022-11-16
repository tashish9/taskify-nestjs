import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { z } from 'zod';
import { Task } from 'src/entities/task.entity';
import { ObjectID } from 'mongodb';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: MongoRepository<Task>,
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  async addTask(taskData: any) {
    try {
      const task = new Task();

      const dateSchema = z.preprocess(
        (arg) => {
          if (typeof arg == 'string' || arg instanceof Date)
            return new Date(arg);
        },
        z.date({
          required_error: 'Please select a date and time',
          invalid_type_error: "That's not a date!",
        }),
      );

      const AddTaskSchema = z.object({
        assignee: z.string().optional(),
        description: z.string().min(1),
        name: z.string().min(1),
        status: z.string().min(1),
        dueDate: dateSchema,
      });

      AddTaskSchema.parse(taskData);

      task.assignee = taskData.assignee || null;
      task.description = taskData.description;
      task.dueDate = taskData.dueDate;
      task.name = taskData.name;
      task.status = taskData.status;

      return this.tasksRepository.save(task);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateTask(taskId: string, taskData: any): Promise<Task> {
    const task = await this.tasksRepository.findOneBy(taskId);

    const updatedTaskResult = await this.tasksRepository.findOneAndUpdate(
      {
        _id: new ObjectID(taskId),
      },
      {
        $set: Object.assign({}, task, taskData),
      },
      {
        returnOriginal: false,
      },
    );

    return updatedTaskResult.value;
  }

  async assignTask(taskId: string, taskData: any): Promise<Task> {
    const AssignTaskSchema = z.object({
      assignee: z.string(),
    });

    AssignTaskSchema.parse(taskData);

    const user = await this.usersRepository.findOneBy(taskData.assignee);

    const task = await this.updateTask(taskId, {
      assignee: user._id,
    });

    const populatedTasks = await this.populateTasks([task]);

    return populatedTasks[0];
  }

  async populateTasks(tasks: Task[]): Promise<Task[]> {
    const users = await this.usersRepository.find();

    tasks.forEach((el) => {
      el.assignee = users.find((user) => {
        if (!el.assignee) return null;
        return user._id.toString() === el.assignee.toString();
      });
    });

    return tasks;
  }
}
