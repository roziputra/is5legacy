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
  @Expose({ name: 'tts_type_id' })
  ttsTypeIds: string[];

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'tts_status' })
  ttsStatus: string[];

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return value ? value.split(',')?.map((i) => i.trim()) : [];
  })
  @Expose({ name: 'id' })
  surveyIds: string[];
}
