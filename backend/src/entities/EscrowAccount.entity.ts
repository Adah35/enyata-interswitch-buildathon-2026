import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Relation,
} from 'typeorm';
import { EscrowStatus } from './enums';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity('escrow_accounts')
export class EscrowAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  taskId: string;

  @OneToOne(() => Task, (task) => task.escrow)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  posterUserId: string;

  @ManyToOne(() => User, (user) => user.escrowsAsPoster)
  @JoinColumn({ name: 'posterUserId' })
  poster: User;

  @Column({ nullable: true, type: 'uuid' })
  taskerUserId: string | null;

  @ManyToOne(() => User, (user) => user.escrowsAsTasker, { nullable: true })
  @JoinColumn({ name: 'taskerUserId' })
  tasker: User | null;

  @Column({ type: 'bigint' })
  grossAmountKobo: string;

  @Column({ type: 'bigint' })
  platformFeeKobo: string;

  @Column({ type: 'bigint' })
  taskerCommissionKobo: string;

  @Column({ type: 'bigint' })
  netPayoutKobo: string;

  // Interswitch references
  @Column({ nullable: true, unique: true, type: 'varchar' })
  iswTransactionRef: string | null;

  @Column({ nullable: true, type: 'varchar' })
  iswPaymentRef: string | null;

  @Column({ nullable: true, type: 'varchar' })
  iswTransferRef: string | null;

  @Column({ nullable: true, type: 'varchar' })
  iswRefundRef: string | null;

  @Column({ type: 'enum', enum: EscrowStatus, default: EscrowStatus.HOLDING })
  status: EscrowStatus;

  @Column({ type: 'timestamp', nullable: true })
  heldAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  autoReleaseAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Transaction', 'escrow')
  transactions: Relation<any[]>;
}
