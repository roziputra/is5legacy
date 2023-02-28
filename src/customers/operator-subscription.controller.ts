import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OperatorSubscriptionService } from './operator-subscription.service';
import { OperatorSubscriptionInterceptor } from './interceptors/operator-subscription.interceptor';
import { GetOperatorSubscriptionDto } from './dtos/get-operator-subscription.dto';
import { CreateOperatorSubscriptionDto } from './dtos/create-operator-subscription.dto';

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

  @Post('sheets')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body()
    createOperatorSubscriptionDto: CreateOperatorSubscriptionDto,
  ): Promise<any> {
    return this.operatorSubscriptionService.saveDataFromGoogleSheet(
      createOperatorSubscriptionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number): Promise<any> {
    return this.operatorSubscriptionService.remove(id);
  }

  @Get('operator-subscriptions')
  @UseInterceptors(OperatorSubscriptionInterceptor)
  async getOperatorSubscription(
    @Query()
    getOperatorSubscriptionDto: GetOperatorSubscriptionDto,
  ): Promise<any> {
    return this.operatorSubscriptionService.getOperatorSubscriptions(
      getOperatorSubscriptionDto,
    );
  }
}
