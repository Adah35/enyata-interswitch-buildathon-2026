import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { UserRole, KycLevel } from './enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: KycLevel, default: KycLevel.NONE })
  kycLevel: KycLevel;


  // KYC fields
  @Column({ nullable: true, unique: true })
  nin: string | null;

  @Column({ nullable: true, unique: true })
  bvn: string | null;

  @Column({ nullable: true, type: 'text' })
  passportUrl: string | null;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: 'text' })
  avatarUrl: string | null;

  @Column({ nullable: true, type: 'text' })
  bio: string | null;

  // Bank account — write-once via Interswitch name lookup
  @Column({ nullable: true, type: 'varchar' })
  bankCode: string | null;

  @Column({ nullable: true, type: 'varchar' })
  accountNumber: string | null;

  @Column({ nullable: true, type: 'varchar' })
  accountName: string | null;

  @Column({ type: 'int', default: 0 })
  totalTasksPosted: number;

  @Column({ type: 'int', default: 0 })
  totalTasksDone: number;

  @Column({ type: 'float', nullable: true })
  avgRatingAsTasker: number | null;

  @Column({ type: 'float', nullable: true })
  avgRatingAsPoster: number | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ─── Relations ───────────────────────────────────────────────────────────

  @OneToMany('RefreshToken', 'user')
  refreshTokens: Relation<any[]>;

  @OneToMany('Task', 'poster')
  postedTasks: Relation<any[]>;

  @OneToMany('Task', 'tasker')
  assignedTasks: Relation<any[]>;

  @OneToMany('Bid', 'tasker')
  bids: Relation<any[]>;

  @OneToMany('EscrowAccount', 'poster')
  escrowsAsPoster: Relation<any[]>;

  @OneToMany('EscrowAccount', 'tasker')
  escrowsAsTasker: Relation<any[]>;

  @OneToMany('Transaction', 'user')
  transactions: Relation<any[]>;

  @OneToMany('Payout', 'tasker')
  payouts: Relation<any[]>;

  @OneToMany('Dispute', 'filedBy')
  disputesFiledBy: Relation<any[]>;

  @OneToMany('Rating', 'rater')
  ratingsGiven: Relation<any[]>;

  @OneToMany('Rating', 'ratee')
  ratingsReceived: Relation<any[]>;

  @OneToMany('Message', 'sender')
  sentMessages: Relation<any[]>;

  @OneToMany('Notification', 'user')
  notifications: Relation<any[]>;
}