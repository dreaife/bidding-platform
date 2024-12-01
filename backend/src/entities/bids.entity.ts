import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './projects.entity';
import { User } from './users.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  bid_id: number;

  @ManyToOne(() => Project, (project) => project.project_id, { onDelete: 'CASCADE' })
  project_id: Project;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  bidder_id: User;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
