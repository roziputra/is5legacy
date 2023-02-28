import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStbRequestDetailDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsString()
  unit: string;
}
