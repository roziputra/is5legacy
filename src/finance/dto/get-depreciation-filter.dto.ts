import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetDepreciationFilterDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'branch_id' })
  branchId: string;

  @IsNotEmpty()
  @Type(() => String)
  @Transform(({ value }) => {
    const [year, month] = value.split('-', 2).map((i) => parseInt(i));
    const lastDate = new Date(year, month, 0).getDate();
    return {
      fromDate: `${year}-${('0' + month).slice(-2)}-01`,
      toDate: `${year}-${('0' + month).slice(-2)}-${lastDate}`,
    };
  })
  period: any;
}