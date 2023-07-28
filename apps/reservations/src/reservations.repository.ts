import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import {
  ReservationDocument,
  reservationCollectionName,
} from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectModel(reservationCollectionName)
    reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
  }
}
