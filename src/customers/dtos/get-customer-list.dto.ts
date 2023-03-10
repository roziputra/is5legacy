import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { Type, Transform, Expose } from 'class-transformer';

export class GetCustomerListDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',') : [];
  })
  @Expose({ name: 'customer_id' })
  customerIds: string[];
}
