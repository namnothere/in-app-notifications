import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationService } from 'src/notification/notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationDto } from 'src/notification/dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update-notification.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  updateProfile = async (user_id: number, update_dto: UpdateUserDto): Promise<any> => {
    try {
      const user = await this.userRepository.findOne({
        where: {id: user_id}
      });
      const updated_user = {
        ...user,
        username: update_dto.username,
        email: update_dto.email,
      }
      const saved_user = await this.userRepository.save(updated_user);
      if (saved_user) {
        console.log("sendPush");
        await this.notificationService.sendPush(
          updated_user,
          'Profile update',
          'Your Profile have been updated successfully'
        ).catch((e: any) => {
          console.log('Error sending push notification', e);
        });
      }
      return saved_user;
    } catch (err) {
      return err;
    }
  }

  enablePush = async (
    user_id: number,
    update_dto: NotificationDto
  ): Promise<any> => {
    const user = this.userRepository.findOne({
      where: {id: user_id}
    });

    return await this.notificationService.acceptPushNotification(
      await user,
      update_dto
    )
  }

  disablePush = async (
    user_id: number,
    update_dto: UpdateNotificationDto
  ): Promise<any> => {
    const user = await this.userRepository.findOne({
      where: { id: user_id }
    });
    return await this.notificationService.disablePushNotification(
      user,
      update_dto
    );
  };

  getPushNotifications = async (): Promise<any> => {
    return await this.notificationService.getNotifications();
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      id,
      updateUserDto
    )
  }

  remove(id: number) {
    try {
      this.userRepository.delete(id);
      return `User ${id} deleted successfully`;
    } catch (err) {
      return err;
    }
  }
}
