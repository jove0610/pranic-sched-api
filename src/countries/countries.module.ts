import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country, CountrySchema } from './schemas/country.schema';
import { StatesModule } from 'src/states/states.module';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    forwardRef(() => StatesModule),
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [MongooseModule],
})
export class CountriesModule {}
