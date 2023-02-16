import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStbEngineerBarangDto {
  @IsNotEmpty()
  @IsString()
  serial: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;
}
