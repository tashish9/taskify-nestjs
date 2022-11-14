import { Column } from 'typeorm';

export enum TaskStatus {
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Ready for Review',
  COMPLETED = 'Completed',
}

export class Task {
  @Column()
  name: string;

  @Column()
  properties: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column()
  assignee: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.ASSIGNED,
  })
  status: TaskStatus;
}
