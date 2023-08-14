import { NOTIFICATIONS_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { ReservationCreateChargeDto } from './dto/reservation-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_API_KEY'),
    {
      apiVersion: '2022-11-15',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async createCharge({
    card,
    amount,
    email,
    event,
  }: ReservationCreateChargeDto) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card,
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      });

      this.notificationsService.emit('notify_email', {
        email,
        text: `<h3>Your payment of $${amount} has completed successfully.</h3>`,
        event,
      });

      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
