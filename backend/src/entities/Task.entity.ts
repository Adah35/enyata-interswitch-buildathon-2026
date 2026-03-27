import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { TaskStatus } from './enums';
import { User } from './User.entity';
import { Category } from './Category.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  posterId: string;

  @ManyToOne(() => User, (user) => user.postedTasks)
  @JoinColumn({ name: 'posterId' })
  poster: User;

  @Column({ nullable: true, type: 'uuid' })
  taskerId: string | null;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  @JoinColumn({ name: 'taskerId' })
  tasker: User | null;

  @Column({ nullable: true, type: 'uuid' })
  categoryId: string | null;

  @ManyToOne('Category', 'tasks', { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.DRAFT })
  status: TaskStatus;

  // Location
  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column()
  locationDisplay: string;

  @Column({ type: 'text' })
  locationExact: string;

  // Pricing (stored in kobo as string since PG bigint → string in JS)
  @Column({ type: 'bigint' })
  budgetKobo: string;

  @Column({ type: 'bigint', nullable: true })
  finalPriceKobo: string | null;

  // Media
  @Column({ type: 'text', array: true, default: [] })
  mediaUrls: string[];

  // Scheduling
  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  durationEstimate: string | null;

  // Completion
  @Column({ type: 'text', array: true, default: [] })
  completionProofUrls: string[];

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  autoReleaseAt: Date | null;

  // Cancellation
  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date | null;

  @Column({ nullable: true, type: 'text' })
  cancelReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ─── Relations ───────────────────────────────────────────────────────────

  @OneToMany('Bid', 'task')
  bids: Relation<any[]>;

  @OneToOne('EscrowAccount', 'task')
  escrow: Relation<any> | null;

  @OneToOne('Dispute', 'task')
  dispute: Relation<any> | null;

  @OneToMany('Rating', 'task')
  rating: Relation<any[]>;

  @OneToMany('Message', 'task')
  messages: Relation<any[]>;
}
