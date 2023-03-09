import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStbEngineerDetailDto {
  @IsNotEmpty()
  @IsString()
  serial: string;

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
