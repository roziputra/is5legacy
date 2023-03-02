import { Transform, Type, Expose } from 'class-transformer';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class GetPromoFilterDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'start_date' })
  startDate: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'end_date' })
  endDate: string;

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
  @IsString()
  @Expose({ name: 'is_active' })
  isActive: string;

  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return typeof value !== 'undefined' ? value.split(',') : [];
  })
  @Expose({ name: 'promo_id' })
  promoIds: string[];
}
