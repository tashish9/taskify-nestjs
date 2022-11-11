import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { Task } from './task';

@Entity('teams')
export class Team {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  teamMembers: string[];

  @Column('array', { default: [] })
  tasks: Task[] = [];
}
