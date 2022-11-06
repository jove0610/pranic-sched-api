import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtPayload } from './interfaces';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EnvConfig } from '../../config/environment';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<EnvConfig>('database.jwtSecret'),
      passReqToCallback: true,
    });
  }

  async validate(@Request() req: any, payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);
    if (user === null) {
      throw new UnauthorizedException();
    }

    // throw 401 if token used is blacklisted
    const jwtToken: string = req.headers.authorization.split(' ')[1];
    const blToken = await this.authService.findBlacklistedToken(jwtToken);
    if (blToken !== null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
