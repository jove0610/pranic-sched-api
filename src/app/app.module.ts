import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import envConfig from 'src/config/envConfig';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [envConfig], cache: true, isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        autoIndex: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
