import { User } from 'src/users/entities/user.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification_tokens' })
export class NotificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => User)
  user: User;

  @Column()
  device_type: string;

  @Column({
    default: 'Default Title',
  })
  title: string;

  @Column({ type: 'longtext', nullable: true })
  body: any;

  @Column({
    nullable: true
  })
  created_by: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;
}
