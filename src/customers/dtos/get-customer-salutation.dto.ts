import { Type, Transform, Expose } from 'class-transformer';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class GetCustomerSalutationDto {
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return typeof value != 'undefined' ? value.split(',') : null;
  })
  @Expose({ name: 'salutation_id' })
  salutationIds: string[];
}
