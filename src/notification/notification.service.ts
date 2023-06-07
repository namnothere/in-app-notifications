import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationToken } from './entities/notification-token.entity';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/users/entities/user.entity';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'firebase-admin-sdk.json'),
  ),
});

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications) private readonly notificationsRepo: Repository<Notifications>,
    @InjectRepository(NotificationToken) private readonly notificationTokenRepo: Repository<NotificationToken>,
  ) {}

  acceptPushNotification = async (
    user: User,
    notification_dto: NotificationDto ,
  ): Promise<NotificationToken> => {
    await this.notificationTokenRepo.update(
      { user: user },
      {
        status: 'INACTIVE',
      }
    );
    // console.log("acceptPushNotification updated", await this.notificationTokenRepo.find({
    //   where: { user: { id: user.id }},
    // }));
    // save to db
    const notification_token = await this.notificationTokenRepo.save({
      user,
      device_type: notification_dto.device_type,
      notification_token: notification_dto.notification_token,
      status: 'ACTIVE',
    });
    return notification_token;
  };

  disablePushNotification = async (
    user: any,
    update_dto: UpdateNotificationDto,
  ): Promise<void> => {
    try {
      await this.notificationTokenRepo.update(
        { user: { id: user.id },
        device_type: update_dto.device_type},
        {
          status: 'INACTIVE',
        }
      )
    } catch (err) {
      return err;
    }
  };

  getNotifications = async (): Promise<any> => {
    // return await this.notificationsRepo.find();
    // return all notifications from db
    return await this.notificationsRepo.find({
      where: {
        status: 'ACTIVE',
      },
    })
  };

  sendPush = async (user: any, title: string, body: string): Promise<void> => {
    try {
      const notification = await this.notificationTokenRepo.findOne({
        // where: { user: user , status: 'ACTIVE' },
        where: { user: user , status: 'ACTIVE' },
      });

      // const notification = await this.notificationTokenRepo.findOne({
      //   where: { user: { id: user.id }, status: 'ACTIVE' },
      // })

      if (notification) {
        await this.notificationsRepo.save({
          notification_token: notification,
          title,
          body,
          status: 'ACTIVE',
          created_by: user.username,
        });
        // console.log("sendPush", await this.notificationsRepo.find({
        //   where: { notification_token: notification },
        // }));
        await firebase
          .messaging()
          .send({
            notification: { title, body },
            token: notification.id.toString(),
          })
      }
    } catch (err) {
      return err;
    }
  };
}
