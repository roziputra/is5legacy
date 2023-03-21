import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class FilterStockMasterDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'branch_id' })
  branchId: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Type(() => Boolean)
  @Expose({ name: 'is_active' })
  isActive: boolean;
}
