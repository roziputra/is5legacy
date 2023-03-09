import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class GetServiceFilterDto {
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return typeof value !== 'undefined' ? value.split(',') : [];
  })
  @Expose({ name: 'branch_id' })
  branchIds: string[];

  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return typeof value !== 'undefined' ? value.split(',') : [];
  })
  @Expose({ name: 'service_id' })
  serviceIds: string[];
}
