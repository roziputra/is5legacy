import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestType, Status } from '../entities/stb-request.entity';
import { Expose, Transform } from 'class-transformer';

export class FilterStbRequestDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'request_type' })
  requestType: RequestType[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'status' })
  status: Status[];
}
