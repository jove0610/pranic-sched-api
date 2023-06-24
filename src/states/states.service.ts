import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './schemas/state.schema';
import { Country } from 'src/countries/schemas/country.schema';

@Injectable()
export class StatesService {
  constructor(
    @InjectModel(Country.name)
    @Inject(forwardRef(() => Model<Country>))
    private countryModel: Model<Country>,

    @InjectModel(State.name) private stateModel: Model<State>,
  ) {}

  async create(createStateDto: CreateStateDto): Promise<State> {
    const country = await this.countryModel.findById(createStateDto.countryId);
    if (!country) {
      throw new BadRequestException('Country not found.');
    }

    const newState = new this.stateModel(createStateDto);
    return newState.save();
  }

  async findAll(): Promise<State[]> {
    return this.stateModel.find().exec();
  }

  async findOne(id: string): Promise<State> {
    const state = await this.stateModel.findById(id).exec();

    if (!state) {
      throw new NotFoundException('State not found.');
    }
    return state;
  }

  async update(id: string, updateStateDto: UpdateStateDto): Promise<State> {
    if (updateStateDto.countryId) {
      const country = await this.countryModel.findById(
        updateStateDto.countryId,
      );
      if (!country) {
        throw new BadRequestException('Country not found.');
      }
    }

    const state = await this.stateModel
      .findByIdAndUpdate(id, updateStateDto, { new: true })
      .exec();

    if (!state) {
      throw new NotFoundException('State not found.');
    }
    return state;
  }

  async remove(id: string): Promise<State> {
    const state = await this.stateModel.findByIdAndDelete(id).exec();

    if (!state) {
      throw new NotFoundException('State not found.');
    }
    return state;
  }
}
