import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceType } from '../entities/fiber-vendor-services.entity';

export class CreateOperatorSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'vendor_cid' })
  vendorCid: string;

  @IsNotEmpty()
  @IsString()
  type: ServiceType;

  @IsOptional()
  @IsString()
  nsn: string;

  @IsNotEmpty()
  @Expose({ name: 'vendor_id' })
  vendorId: number;

  @IsNotEmpty()
  tagihan: number;
}
