import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersReposity } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersReposity: UsersReposity) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersReposity.create(createUserDto);
  }
}
