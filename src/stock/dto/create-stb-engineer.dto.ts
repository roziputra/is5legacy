import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  RequestType,
  TYPE_MOVED,
  TYPE_REQUESTED,
  TYPE_RETURNED,
} from '../entities/stb-engineer.entity';
import { CreateStbEngineerDetailDto } from './create-stb-engineer-detail.dto';
import { Expose, Type } from 'class-transformer';

export class CreateStbEngineerDto {
  @IsNotEmpty()
  engineer: string;

  @IsNotEmpty()
  @IsIn([TYPE_REQUESTED, TYPE_RETURNED, TYPE_MOVED])
  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateStbEngineerDetailDto)
  details: CreateStbEngineerDetailDto[];
}
