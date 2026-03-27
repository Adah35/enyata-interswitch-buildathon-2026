import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType, TransactionStatus } from './enums';
import { User } from './User.entity';
import { EscrowAccount } from './EscrowAccount.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column({ nullable: true, type: 'uuid' })
  escrowId: string | null;

  @ManyToOne(() => EscrowAccount, (e) => e.transactions, { nullable: true })
  @JoinColumn({ name: 'escrowId' })
  escrow: EscrowAccount | null;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'bigint' })
  amountKobo: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ nullable: true, type: 'varchar' })
  iswReference: string | null;

  @Column({ nullable: true, type: 'varchar' })
  iswResponseCode: string | null;

  @Column({ unique: true })
  idempotencyKey: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
