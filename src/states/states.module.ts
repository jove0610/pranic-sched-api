import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { State, StateSchema } from './schemas/state.schema';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
    forwardRef(() => CountriesModule),
  ],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [MongooseModule],
})
export class StatesModule {}
