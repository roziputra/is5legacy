import { IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class FilterEmployeeDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'branch_id' })
  branchId: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'department_id' })
  departmentId: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'status' })
  status: string[];
}
