import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ versionKey: false, timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
