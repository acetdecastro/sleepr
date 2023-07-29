import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class ReservationDocument extends AbstractDocument {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  invoiceId: string;
}

export const reservationsCollectionName = 'reservations';
export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
