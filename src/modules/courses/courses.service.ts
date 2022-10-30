import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private model: Model<CourseDocument>) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const newCourse = new this.model(createCourseDto);
    return newCourse.save();
  }

  async findAll(): Promise<Course[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.model.findById(id).exec();
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course | null> {
    const course = await this.model.findById(id).exec();
    if (course === null) {
      return null;
    }

    if (updateCourseDto.name) course.name = updateCourseDto.name;
    return course.save();
  }

  async remove(id: string): Promise<Course | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
