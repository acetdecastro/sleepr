import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  text: string;
}
