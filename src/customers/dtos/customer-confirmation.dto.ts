import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CustomerConfirmationDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'customer_id' })
  customerId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'customer_service_id' })
  customerServiceId: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  period: Date;

  @IsNotEmpty()
  @Type(() => Boolean)
  confirmation: boolean;

  @ValidateIf((o) => !o.confirmation)
  @IsNotEmpty()
  reason: string;
}
