import {
  AbstractRepository,
  UserDocument,
  usersCollectionName,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersReposity extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersReposity.name);

  constructor(
    @InjectModel(usersCollectionName) userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
