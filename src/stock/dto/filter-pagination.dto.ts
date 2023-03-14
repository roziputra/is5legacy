import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterPaginationDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit = 15;
}
