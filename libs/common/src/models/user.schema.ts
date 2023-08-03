import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const usersCollectionName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserDocument);
