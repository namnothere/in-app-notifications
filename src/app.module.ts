import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from './notification/notification.module';
import { UsersModule } from './users/users.module';
import { Notifications } from './notification/entities/notification.entity';
import { NotificationToken } from './notification/entities/notification-token.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      username: "root",
      password: "root",
      database: "in_app_notification",
      entities: [Notifications, NotificationToken, User],
      synchronize: true,
  }),
    NotificationModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
