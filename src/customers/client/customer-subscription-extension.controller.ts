import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersInvoiceService } from '../customer-invoice.service';
import { CustomerConfirmationDto } from '../dtos/customer-confirmation.dto';

@UseGuards(AuthGuard('api-key'))
@Controller(
  'api/client/v1/customers/:customerId/subscriptions/:subscriptionId/extension/',
)
export class CustomerSubscriptionExtensionController {
  constructor(
    private readonly customerInvoiceService: CustomersInvoiceService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async procesCustomerSubscriptionExtension(
    @Body() customerConfirmationDto: CustomerConfirmationDto,
  ): Promise<any> {
    await this.customerInvoiceService.createInvoiceFromNis(
      customerConfirmationDto,
    );
    return {
      title: 'Berhasil',
      message: 'berhasil proses konfirmasi perpanjangan customer',
    };
  }
}
