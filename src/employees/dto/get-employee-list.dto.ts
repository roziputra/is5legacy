import { Type, Transform, Expose } from 'class-transformer';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class GetEmployeeListDto {
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return typeof value !== 'undefined' ? value.split(',') : [];
  })
  @Expose({ name: 'employee_id' })
  employeeIds: string[];
}
