import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationDocument,
  notificationsCollectionName,
} from './models/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsRepository extends AbstractRepository<NotificationDocument> {
  protected readonly logger = new Logger(NotificationsRepository.name);

  constructor(
    @InjectModel(notificationsCollectionName)
    notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
}
