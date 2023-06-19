import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './schemas/country.schema';
import { DUPLICATE_KEY_CODE } from 'src/constants/mongoErrCodes';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    let newUser = new this.countryModel(createCountryDto);
    try {
      newUser = await newUser.save();
      return newUser;
    } catch ({ name, code, message }) {
      if (code === DUPLICATE_KEY_CODE) {
        throw new BadRequestException('Country already exist.');
      }
      console.error(`${name}: ${message}`);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryModel.findById(id).exec();

    if (!country) {
      throw new NotFoundException('Country not found.');
    }
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    let country: Country | null;
    try {
      country = await this.countryModel
        .findByIdAndUpdate(id, updateCountryDto, { new: true })
        .exec();
    } catch ({ code, name, message }) {
      if (code === DUPLICATE_KEY_CODE) {
        throw new BadRequestException('Country already exist.');
      }
      console.error(`${name}: ${message}`);
      throw new InternalServerErrorException();
    }

    if (!country) {
      throw new NotFoundException('Country not found.');
    }
    return country;
  }

  async remove(id: string): Promise<Country> {
    const country = await this.countryModel.findByIdAndDelete(id).exec();

    if (!country) {
      throw new NotFoundException('Country not found.');
    }
    return country;
  }
}
