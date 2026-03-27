import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity('ratings')
@Unique(['taskId', 'raterId'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.rating)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  raterId: string;

  @ManyToOne(() => User, (user) => user.ratingsGiven)
  @JoinColumn({ name: 'raterId' })
  rater: User;

  @Column()
  rateeId: string;

  @ManyToOne(() => User, (user) => user.ratingsReceived)
  @JoinColumn({ name: 'rateeId' })
  ratee: User;

  @Column({ type: 'int' })
  score: number;

  @Column({ nullable: true, type: 'text' })
  reviewText: string | null;

  @Column({ default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
