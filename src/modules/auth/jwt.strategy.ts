import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import jwtPayload from './jwt-payload.interface';
import { EnvConfig } from '../../config/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<EnvConfig>('database.jwtSecret'),
    });
  }

  async validate(payload: jwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
