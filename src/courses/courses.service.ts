import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schemas/course.schema';
import { DUPLICATE_KEY_CODE } from 'src/constants/mongoErrCodes';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    let newCourse = new this.courseModel(createCourseDto);
    try {
      newCourse = await newCourse.save();
      return newCourse;
    } catch ({ name, code, message }) {
      if (code === DUPLICATE_KEY_CODE) {
        throw new BadRequestException('Course already exist.');
      }
      console.error(`${name}: ${message}`);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();

    if (!course) {
      throw new NotFoundException('Course not found.');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    let course: Course | null;
    try {
      course = await this.courseModel
        .findByIdAndUpdate(id, updateCourseDto, { new: true })
        .exec();
    } catch ({ code, name, message }) {
      if (code === DUPLICATE_KEY_CODE) {
        throw new BadRequestException('Course already exist.');
      }
      console.error(`${name}: ${message}`);
      throw new InternalServerErrorException();
    }

    if (!course) {
      throw new NotFoundException('Course not found.');
    }
    return course;
  }

  async remove(id: string): Promise<Course> {
    const course = await this.courseModel.findByIdAndDelete(id).exec();

    if (!course) {
      throw new NotFoundException('Course not found.');
    }
    return course;
  }
}
