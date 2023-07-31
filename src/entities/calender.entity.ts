import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'calender' })
export class Calender {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ default: null })
  description: string;

  @Column({ default: false })
  instant: boolean;

  @Column({ default: null })
  custom_date: Date;

  @Column({ default: 'minutes' })
  notification_alert_type: string;

  @Column({ default: 15 })
  notification_alert_time: number;

  @Column({ default: false })
  cancelled: boolean;

  @Column({ default: null })
  cron_job: string;

  @ManyToOne(() => User, (user) => user.calender_id)
  @JoinColumn({ name: 'user_id' })
  user_id!: User;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;
}
