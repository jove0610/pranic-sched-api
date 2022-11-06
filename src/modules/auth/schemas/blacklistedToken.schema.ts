import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlacklistedTokenDocument = BlacklistedToken & Document;

@Schema({ versionKey: false, timestamps: true })
export class BlacklistedToken {
  @Prop({ required: true, unique: true })
  token: string;
}

export const BlacklistedTokenSchema =
  SchemaFactory.createForClass(BlacklistedToken);
