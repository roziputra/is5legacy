import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSurveyTicketDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'customer_id' })
  customerId: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'customer_service_id' })
  @Type(() => Number)
  customerServiceId: number;
}
