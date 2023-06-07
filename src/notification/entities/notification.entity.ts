import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { NotificationToken } from './notification-token.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'notifications' })
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'notification_token_id', referencedColumnName: 'id' })
  @ManyToOne(() => NotificationToken)
  notification_token: NotificationToken;

  @Column()
  title: string;

  @Column({ type: 'longtext', nullable: true })
  body: any;

  @Column()
  created_by: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
