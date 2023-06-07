import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Put } from '@nestjs/common';
import { NotificationDto } from 'src/notification/dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update-notification.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() update_dto: any,
    @Param('id') user_id: number,
  ) {
    await this.usersService.updateProfile(user_id ,update_dto);
    return {
      message: 'Profile updated successfully',
    }
  }

  @Put('push/enable/:id')
  @HttpCode(HttpStatus.OK)
  async enablePush(
    // @Body() update_dto: NotificationDto,
    @Body() update_dto: any,
    @Param('id') user_id: number,
  ) {
    return {
      message: 'Push enable',
      res: await this.usersService.enablePush(user_id, update_dto)
    }
  }

  @Put('push/disable/:id')
  @HttpCode(HttpStatus.OK)
  async disablePush(
    @Param('id') user_id: number,
    @Body() update_dto: UpdateNotificationDto,
  ) {
    return await this.usersService.disablePush(user_id, update_dto)
  }

  @Get('push/notifications')
  @HttpCode(HttpStatus.OK)
  async fetchPusNotifications() {
    return await this.usersService.getPushNotifications();
  }
}
