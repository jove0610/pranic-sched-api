import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';

import { AuthService } from './auth.service';
import { LoginResponse } from './interfaces';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Request() req: any): Promise<User> {
    return req.user;
  }
}
