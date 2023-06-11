import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.getOrThrow<string>('app.jwtSecret'),
          signOptions: {
            expiresIn: config.getOrThrow<number>('auth.accessTokenExpiresIn'),
          },
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
