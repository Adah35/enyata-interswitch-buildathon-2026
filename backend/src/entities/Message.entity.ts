import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MessageSenderType } from './enums';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.messages)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'enum', enum: MessageSenderType, default: MessageSenderType.USER })
  senderType: MessageSenderType;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
