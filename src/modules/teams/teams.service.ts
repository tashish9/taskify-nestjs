import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './teams.entity';
import { MongoRepository } from 'typeorm';
import { z } from 'zod';
import { Task } from 'db/task';
import { ObjectID } from 'mongodb';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: MongoRepository<Team>,
  ) {}

  async findAllTeams(): Promise<Team[]> {
    try {
      const data = await this.teamsRepository.find();
      return data;
    } catch (error: any) {
      console.error(error);
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
      team.teamMembers = data.teamMembers;

      return this.teamsRepository.save(team);
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findTeam(teamId: string): Promise<Team> {
    return this.teamsRepository.findOneBy(teamId);
  }

  async addTask(teamId: string, taskData: any): Promise<Team> {
    const task = new Task();

    // const AddTaskSchema = z.object({
    //   assignee: z.string().min(1),
    //   description: z.string().min(1),
    //   name: z.string().min(1),
    //   dueDate: z.string().optional(),
    // });

    task.assignee = taskData.assignee;
    task.description = taskData.description;
    task.dueDate = taskData.dueDate;
    task.name = taskData.name;
    task.properties = taskData.properties;
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
}
