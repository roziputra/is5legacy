import { Transform, Type, Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetListTtsSurveyDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',') : [];
  })
  @Expose({ name: 'survey_id' })
  surveyIds: string[];
}
