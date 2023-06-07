import { Notifications } from 'src/notification/entities/notification.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: any;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;
  
}
