import { Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class ProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  price: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value ?? null))
  tags: string;
}

export class UpdateProductDto extends PartialType(ProductDto) {
  @IsOptional()
  @Expose({ toPlainOnly: true })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(5)
  rate?: string;
}
