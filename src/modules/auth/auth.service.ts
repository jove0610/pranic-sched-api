import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtPayload, LoginResponse } from './interfaces';
import { UserDocument } from '../users/schemas/user.schema';
import {
  BlacklistedToken,
  BlacklistedTokenDocument,
} from './schemas/blacklistedToken.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectModel(BlacklistedToken.name)
    private model: Model<BlacklistedTokenDocument>,
  ) {}

  async login(user: UserDocument): Promise<LoginResponse> {
    const payload: JwtPayload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async createBlacklistedToken(token: string): Promise<void> {
    const newBlacklistedToken = new this.model({ token });
    await newBlacklistedToken.save();
  }

  async findBlacklistedToken(token: string): Promise<BlacklistedToken | null> {
    return this.model.findOne({ token }).exec();
  }
}
