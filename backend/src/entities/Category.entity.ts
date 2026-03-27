import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, type: 'varchar' })
  icon: string | null;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('Task', 'category')
  tasks: Relation<any[]>;

  @CreateDateColumn()
  createdAt: Date;
}
