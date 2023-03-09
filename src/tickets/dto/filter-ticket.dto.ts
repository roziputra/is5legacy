import { Transform } from 'class-transformer';
import { IsOptional, IsString, isArray } from 'class-validator';

export class FilterTicketDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (isArray(value)) {
      return value;
    }
    return value.split(',').map((i) => i.trim());
  })
  engineer: string[];
}
