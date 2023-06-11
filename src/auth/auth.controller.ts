import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getUser() {
    return this.authService.getAuthUser();
  }
}
