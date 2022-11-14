import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { Task } from './task';
import { User } from './user.entity';

@Entity('teams')
export class Team {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column('array', { default: [] })
  teamMembers: ObjectID[];

  @Column('array', { default: [] })
  tasks: Task[] = [];
}
