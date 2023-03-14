import { IsNotEmpty, IsString } from 'class-validator';
import { TransferType } from '../entities/stb-engineer.entity';
import { Status } from '../entities/stb-request.entity';
import { Expose, Transform } from 'class-transformer';

export class FilterStbTransferDto {
  @IsNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'transfer_type' })
  transferType: TransferType[];

  @IsNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'status' })
  status: Status[];
}
