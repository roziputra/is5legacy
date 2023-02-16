import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterEngineerInventoryDto {
  @IsOptional()
  @IsString()
  engineer: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsNotEmpty()
  @IsString()
  branch: string;
}
