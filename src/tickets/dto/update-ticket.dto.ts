import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSurveyTicketDto {
  @IsNotEmpty()
  @IsString()
  customer_id: string;

  @IsNotEmpty()
  @IsString()
  customer_service_id: string;
}
