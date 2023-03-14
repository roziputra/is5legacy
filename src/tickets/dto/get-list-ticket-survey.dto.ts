import { Transform, Type, Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetListTicketSurveyDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'survey_id' })
  surveyIds: string[];
}
