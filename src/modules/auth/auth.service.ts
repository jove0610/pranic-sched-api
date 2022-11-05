import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import jwtPayload from './jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (user === null) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    return this.usersService.findByEmail(email, false);
  }

  async login(user: UserDocument) {
    const payload: jwtPayload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
