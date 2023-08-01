import { AbstractDocument, EventType, NotificationType } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class NotificationDocument extends AbstractDocument {
  @Prop({ required: true, enum: NotificationType })
  type: string;

  @Prop({ required: true, enum: EventType })
  event: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  failReason?: string;
}

export const notificationsCollectionName = 'notifications';
export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
