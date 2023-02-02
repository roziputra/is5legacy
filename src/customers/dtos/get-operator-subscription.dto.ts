import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetOperatorSubscriptionDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value.split(',');
  })
  @Expose({ name: 'branch_ids' })
  branchIds: string[];

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value.split(',');
  })
  status: string[];

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @Transform(({ value }) => {
    return value.split(',').map((i) => parseInt(i.trim()));
  })
  @Expose({ name: 'vendor_ids' })
  vendorIds: number[];
}
