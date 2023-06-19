import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { DUPLICATE_KEY_CODE } from 'src/constants/mongoErrCodes';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    let newUser = new this.userModel(createUserDto);
    try {
      newUser = await newUser.save();
      // @ts-expect-error: password should not be included in response
      newUser.password = undefined;
      return newUser;
    } catch ({ name, code, message }) {
      if (code === DUPLICATE_KEY_CODE) {
        throw new BadRequestException('Email already exist.');
      }
      console.error(`${name}: ${message}`);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
