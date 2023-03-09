import {
  IsArray,
  IsDate,
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
import { Expose, Type } from 'class-transformer';
import { CreateStbRequestDetailDto } from './create-stb-request-detail.dto';

export class CreateStbRequestDto {
  @IsNotEmpty()
  engineer: string;

  @IsNotEmpty()
  @IsIn([TYPE_REQUESTED, TYPE_RETURNED, TYPE_MOVED])
  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Expose({ name: 'request_date' })
  requestDate: Date;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateStbRequestDetailDto)
  details: CreateStbRequestDetailDto[];
}
