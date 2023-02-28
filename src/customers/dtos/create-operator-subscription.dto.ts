import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOperatorSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'vendor_cid' })
  vendorCid: string;

  @IsOptional()
  @IsString()
  nsn: string;

  @IsNotEmpty()
  @Expose({ name: 'vendor_id' })
  vendorId: number;

  @IsNotEmpty()
  tagihan: number;
}
