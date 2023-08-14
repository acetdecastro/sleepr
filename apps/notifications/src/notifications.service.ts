import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { NotificationsRepository } from './notification.repository';
import { NotificationStatus, NotificationType } from '@app/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMPT_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail({ email, text, event }: NotifyEmailDto) {
    await this.transporter
      .sendMail({
        from: this.configService.get('SMPT_USER'),
        to: email,
        subject: 'Sleepr Notification',
        html: text,
      })
      .then(async () => {
        await this.notificationsRepository.create({
          type: NotificationType.EMAIL,
          event,
          to: email,
          status: NotificationStatus.SENT,
        });
      })
      .catch(async (error) => {
        console.log(error);
        await this.notificationsRepository.create({
          type: NotificationType.EMAIL,
          event,
          to: email,
          status: NotificationStatus.FAILED,
          failReason: error,
        });
      });
  }
}
