import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.model(createUserDto);
    await newUser.save();
    return this.model.findById(newUser.id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.model.findById(id).exec();
    if (user === null) {
      return null;
    }

    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
    if (updateUserDto.isAdmin) user.isAdmin = updateUserDto.isAdmin;

    return user.save();
  }

  async remove(id: string): Promise<User | null> {
    const user = await this.model.findById(id).exec();
    if (user === null) {
      return null;
    }
    return user.delete();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email }).select('+password').exec();
  }
}
