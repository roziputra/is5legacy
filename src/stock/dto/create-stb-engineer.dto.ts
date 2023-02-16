import { IsArray, IsDate, IsIn, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { RequestType, TYPE_MOVED, TYPE_REQUESTED, TYPE_RETURNED } from '../entities/stb-engineer.entity';
import { CreateStbEngineerBarangDto } from './create-stb-engineer-barang.dto';
import { Expose, Type } from 'class-transformer';

export class CreateStbEngineerDto {
  @IsNotEmpty()
  engineer: string;

  @IsNotEmpty()
  @IsIn([TYPE_REQUESTED, TYPE_RETURNED, TYPE_MOVED])
  @Expose({ name: 'request_type' })
  requestType: RequestType

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Expose({ name: 'request_date' })
  requestDate: Date;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateStbEngineerBarangDto)
  barangs: CreateStbEngineerBarangDto[];
}