import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DisputeStatus, DisputeResolution, DisputeReason } from './enums';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  taskId: string;

  @OneToOne(() => Task, (task) => task.dispute)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ nullable: true, type: 'uuid' })
  escrowId: string | null;

  @Column()
  filedById: string;

  @ManyToOne(() => User, (user) => user.disputesFiledBy)
  @JoinColumn({ name: 'filedById' })
  filedBy: User;

  @Column({ type: 'enum', enum: DisputeReason })
  reason: DisputeReason;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  evidenceUrls: string[];

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  status: DisputeStatus;

  @Column({ type: 'enum', enum: DisputeResolution, nullable: true })
  resolution: DisputeResolution | null;

  @Column({ nullable: true, type: 'uuid' })
  resolvedById: string | null;

  @Column({ nullable: true, type: 'text' })
  resolutionNotes: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
