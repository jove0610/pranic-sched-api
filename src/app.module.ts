import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || '', {
      autoIndex: true,
    }),
    CoursesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
