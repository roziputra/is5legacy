import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OperatorSubscriptionService } from './operator-subscription.service';

@UseGuards(AuthGuard('api-key'))
@Controller('operators/subscriptions')
export class OperatorSubscriptionController {
  constructor(
    private readonly operatorSubscriptionService: OperatorSubscriptionService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  index(): Promise<any> {
    return this.operatorSubscriptionService.findAll();
  }
}
