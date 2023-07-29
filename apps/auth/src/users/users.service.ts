import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersReposity } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersReposity: UsersReposity) {}

  private async isAlreadyExistingUser(email: string) {
    try {
      await this.usersReposity.findOne({ email });
    } catch (error) {
      return; // early return when no existing user was found
    }

    throw new UnprocessableEntityException('Email already exists.');
  }

  async create(createUserDto: CreateUserDto) {
    await this.isAlreadyExistingUser(createUserDto.email);
    return this.usersReposity.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersReposity.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Either incorrect email or password.');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersReposity.findOne(getUserDto);
  }
}
