import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionStatus } from './enums';
import { User } from './User.entity';

@Entity('payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskerId: string;

  @ManyToOne(() => User, (user) => user.payouts)
  @JoinColumn({ name: 'taskerId' })
  tasker: User;

  @Column()
  taskId: string;

  @Column({ type: 'bigint' })
  amountKobo: string;

  @Column({ type: 'varchar' })
  bankCode: string;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @Column({ type: 'varchar' })
  accountName: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ nullable: true, type: 'varchar' })
  iswTransferRef: string | null;

  @Column({ nullable: true, type: 'varchar' })
  iswResponseCode: string | null;

  @Column({ nullable: true, type: 'text' })
  failureReason: string | null;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
