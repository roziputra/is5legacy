import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Ticket } from '../entities/ticket.entity';

export class UpdateSurveyTicketDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'customer_id' })
  CustomerId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'customer_service_id' })
  customerServiceId: string;

  assignedNo: number;
  status: string;
  lockedBy: string;
  visitTime: Date;

  toModel(): Ticket {
    return plainToClass(Ticket, this);
  }
}
