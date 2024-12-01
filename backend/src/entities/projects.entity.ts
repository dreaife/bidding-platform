import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  client_id: User;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  budget_min: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  budget_max: number;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ length: 20, default: 'open' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
