import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import envConfig, { EnvConfig } from './config/environment';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<EnvConfig>('database.mongoURI'),
        autoIndex: true,
      }),
    }),
    AuthModule,
    CoursesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
