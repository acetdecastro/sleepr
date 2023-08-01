import { CreateChargeDto, EventType } from '@app/common';
import { IsEmail, IsEnum } from 'class-validator';

export class ReservationCreateChargeDto extends CreateChargeDto {
  @IsEmail()
  email: string;

  @IsEnum(EventType)
  event: EventType;
}
