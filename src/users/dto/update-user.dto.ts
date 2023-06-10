import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Transform(() => undefined)
  password?: string | undefined;
}
