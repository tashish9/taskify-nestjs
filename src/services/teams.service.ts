import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entities/teams.entity';
import { MongoRepository } from 'typeorm';
import { z, ZodError } from 'zod';
import { Task } from 'src/entities/task';
import { ObjectID } from 'mongodb';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: MongoRepository<Team>,
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  async findAllTeams(): Promise<Team[]> {
    try {
      const teams = await this.teamsRepository.find();

      return this.populateTeams(teams);
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async addTeam(data: any): Promise<Team> {
    try {
      const AddTeamSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        teamMembers: z.string().array(),
      });

      AddTeamSchema.parse(data);
      const team = new Team();

      team.title = data.title;
      team.description = data.description;
      team.teamMembers = data.teamMembers.map((el: string) => {
        return new ObjectID(el);
      });

      return this.teamsRepository.save(team);
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findTeam(teamId: string): Promise<Team> {
    const team = await this.teamsRepository.findOneBy(teamId);
    const populatedTeam = await this.populateTeams([team]);
    return populatedTeam[0];
  }

  async addTask(teamId: string, taskData: any): Promise<Team> {
    try {
      const task = new Task();

      const dateSchema = z.preprocess(
        (arg) => {
          console.log(arg);

          if (typeof arg == 'string' || arg instanceof Date)
            return new Date(arg);
        },
        z.date({
          required_error: 'Please select a date and time',
          invalid_type_error: "That's not a date!",
        }),
      );

      const AddTaskSchema = z.object({
        assignee: z.string().min(1),
        description: z.string().min(1),
        name: z.string().min(1),
        status: z.string().min(1),
        dueDate: dateSchema,
      });

      AddTaskSchema.parse(taskData);

      task.assignee = taskData.assignee;
      task.description = taskData.description;
      task.dueDate = taskData.dueDate;
      task.name = taskData.name;
      task.status = taskData.status;

      const data = await this.teamsRepository.findOneAndUpdate(
        { _id: new ObjectID(teamId) },
        {
          $push: { tasks: task },
        },
        {
          returnOriginal: false,
        },
      );
      return data.value;
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async updateTask(teamId: string, taskData: any): Promise<Team> {
    const team = await this.teamsRepository.findOneBy(teamId);

    if (!team) {
      throw new Error('Team Not found');
    }

    team.tasks = team.tasks.map((el) => {
      console.log(el.name, taskData.name);
      if (el.name === taskData.name) {
        return taskData as Task;
      }
      return el;
    });

    const data = await this.teamsRepository.findOneAndUpdate(
      { _id: new ObjectID(teamId) },
      {
        $set: team,
      },
      {
        returnOriginal: false,
      },
    );
    return data.value;
  }

  async populateTeams(teams: Team[]): Promise<Team[]> {
    const users = await this.usersRepository.find();

    teams.forEach((el) => {
      el.teamMembers = el.teamMembers.map((userId) => {
        return users.find((user) => {
          return userId.toString() === user._id.toString();
        });
      });
    });

    return teams;
  }
}
