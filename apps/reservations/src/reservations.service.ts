import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { FilterQuery } from 'mongoose';
import { ReservationDocument } from './models/reservation.schema';
import { EventType, PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

// test commit

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    try {
      // nestjs will subscribe to the observable by default
      return this.paymentsService
        .send('create_charge', {
          ...createReservationDto.charge,
          email,
          event: EventType.RESERVATION,
        })
        .pipe(
          // executes after the response gets sent back successfully
          map(async (res) => {
            // map will transform the response and return the document to the router/controller
            return this.reservationsRepository.create({
              ...createReservationDto,
              invoiceId: res.id,
              userId,
            });
          }),
        );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(filterQuery: FilterQuery<ReservationDocument>) {
    return this.reservationsRepository.find(filterQuery);
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
