import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { NotificationService } from './notification.service';
import { Notification } from '../entities';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Notification')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: `알림 목록` })
  @ApiOkResponse({
    type: Notification,
    isArray: true,
  })
  @Get('')
  async getNotificationList(@Req() req): Promise<Notification[]> {
    return this.notificationService.getNotificationList(req.user);
  }

  @ApiOperation({ summary: `알림 읽음 처리` })
  @ApiCreatedResponse()
  @ApiForbiddenResponse()
  @Post('')
  async checkReadNotification(@Req() req): Promise<void> {
    return this.notificationService.checkReadNotification(req.user);
  }

  @ApiOperation({ summary: `안 읽은 알림 있는지 여부` })
  @ApiOkResponse({
    schema: {
      properties: {
        isLeft: {
          type: `boolean`,
          example: true,
          description: `true: 안 읽은 알림 있음 / false: 없음`,
        },
      },
    },
  })
  @Get('/unread')
  isUnreadNotificationLeft(@Req() req): Promise<{ isLeft: boolean }> {
    return this.notificationService.isUnreadNotificationLeft(req.user);
  }
}
