import {
  Injectable,
  UnauthorizedException,
  Scope,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Request } from 'express';

import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

export interface loginResponse {
  accessToken: string;
  expiresIn: number;
}

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async login(loginDto: LoginDto): Promise<loginResponse> {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password')
      .exec();

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user?.password || '',
    );
    if (!isMatch || !user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user._id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: this.configService.getOrThrow<number>(
        'auth.accessTokenExpiresIn',
      ),
    };
  }

  async getAuthUser(): Promise<User> {
    // @ts-expect-error: bypass error when accessing _id on mongoose model
    const id: string = this.request?.user?.sub || '';
    return this.userService.findOne(id);
  }
}
