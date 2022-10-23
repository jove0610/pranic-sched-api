import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  passwordUpdatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
