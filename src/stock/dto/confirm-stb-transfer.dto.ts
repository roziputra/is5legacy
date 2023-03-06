import { IsIn, IsNotEmpty } from 'class-validator';
import {
  STATUS_ACCEPTED,
  STATUS_REJECTED,
  Status,
} from '../entities/stb-request.entity';

export class ConfirmStbTransferDto {
  @IsNotEmpty()
  @IsIn([STATUS_ACCEPTED, STATUS_REJECTED])
  status: Status;
}
