import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength } from 'class-validator';

export class TagDto {
  @IsString()
  @MinLength(1)
  name: string;
}

export class UpdateTagDto extends PartialType(TagDto) {}
