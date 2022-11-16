import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { User } from './user.entity';

export enum TaskStatus {
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Ready for Review',
  COMPLETED = 'Completed',
}

@Entity('tasks')
export class Task {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  properties: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column()
  assignee: ObjectID | User;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.ASSIGNED,
  })
  status: TaskStatus;
}
