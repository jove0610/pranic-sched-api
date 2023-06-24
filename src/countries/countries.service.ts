import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './schemas/country.schema';
import { DUPLICATE_KEY_CODE } from 'src/constants/mongoErrCodes';
import { State } from 'src/states/schemas/state.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    @Inject(forwardRef(() => Model<Country>))
    private countryModel: Model<Country>,

    @InjectModel(State.name) private stateModel: Model<State>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    let newCountry = new this.countryModel(createCountryDto);
    try {
      newCountry = await newCountry.save();
      return newCountry;
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
    const state = await this.stateModel.findOne({ countryId: id });
    if (state) {
      throw new BadRequestException('Country is being used.');
    }

    const country = await this.countryModel.findByIdAndDelete(id).exec();

    if (!country) {
      throw new NotFoundException('Country not found.');
    }
    return country;
  }
}
