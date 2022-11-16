import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entities/teams.entity';
import { MongoRepository } from 'typeorm';
import { z, ZodError } from 'zod';
import { Task } from 'src/entities/task.entity';
import { ObjectID } from 'mongodb';
import { User } from 'src/entities/user.entity';
import { TasksService } from './tasks.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: MongoRepository<Team>,
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    @InjectRepository(Task)
    private readonly tasksRepository: MongoRepository<Task>,
    private readonly tasksService: TasksService,
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
        teamMembers: z.string().array().optional(),
      });

      AddTeamSchema.parse(data);
      const team = new Team();

      team.title = data.title;
      team.description = data.description;
      team.teamMembers =
        data.teamMembers?.map((el: string) => {
          return new ObjectID(el);
        }) || [];

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
      const createdTask = await this.tasksService.addTask(taskData);

      const data = await this.teamsRepository.findOneAndUpdate(
        { _id: new ObjectID(teamId) },
        {
          $push: { tasks: createdTask._id },
        },
        {
          returnOriginal: false,
        },
      );

      return data.value;
    } catch (error: any) {
      console.error(error);
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

  async addMember(teamId: string, data: any): Promise<Team> {
    const AddMemberSchema = z.object({
      username: z.string().min(1),
    });

    try {
      AddMemberSchema.parse(data);

      const user = new User();
      user.username = data.username;

      const addedUser = await this.usersRepository.save(user);

      const updatedTeam = await this.teamsRepository.findOneAndUpdate(
        { _id: new ObjectID(teamId) },
        {
          $push: { teamMembers: new ObjectID(addedUser._id) },
        },
        {
          returnOriginal: false,
        },
      );

      return updatedTeam.value;
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async getMemberTasks(teamId: string, userId: string): Promise<Task[]> {
    const teamData = await this.teamsRepository.findOneBy(teamId);

    const populatedTeamArray = await this.populateTeams([teamData]);
    const team = populatedTeamArray[0];

    team.tasks = await this.tasksService.populateTasks(
      team.tasks as ObjectID[],
    );

    return (team.tasks as Task[]).filter((task) => {
      if (!task.assignee) return false;
      return (task.assignee as User)._id.toString() === userId;
    });
  }

  async populateTeams(teams: Team[]): Promise<Team[]> {
    const users = await this.usersRepository.find();
    const tasks = await this.tasksRepository.find();

    teams.forEach((el) => {
      el.teamMembers = el.teamMembers.map((userId) => {
        return users.find((user) => {
          return userId.toString() === user._id.toString();
        });
      });

      el.tasks = el.tasks.map((taskId) => {
        return tasks.find((task) => {
          return taskId.toString() === task._id.toString();
        });
      });
    });

    return teams;
  }
}
