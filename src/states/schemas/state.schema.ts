import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as moongooseSchema } from 'mongoose';

import { Country } from 'src/countries/schemas/country.schema';

export type StateDocument = HydratedDocument<State>;

@Schema({ timestamps: true })
export class State {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: moongooseSchema.Types.ObjectId,
    ref: Country.name,
  })
  countryId: Country;
}

export const StateSchema = SchemaFactory.createForClass(State);
