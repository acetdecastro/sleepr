import { EventType } from '@app/common';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  text: string;

  @IsEnum(EventType)
  event: EventType;
}
