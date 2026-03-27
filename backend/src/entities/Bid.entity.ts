import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { BidStatus } from './enums';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity('bids')
@Unique(['taskId', 'taskerId'])
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.bids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  taskerId: string;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'taskerId' })
  tasker: User;

  @Column({ type: 'bigint' })
  amountKobo: string;

  @Column({ nullable: true, type: 'text' })
  message: string | null;

  @Column({ type: 'enum', enum: BidStatus, default: BidStatus.PENDING })
  status: BidStatus;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
