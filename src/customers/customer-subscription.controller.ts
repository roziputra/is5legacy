import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersInvoiceService } from './customer-invoice.service';
import { MailerService } from '@nestjs-modules/mailer';

@UseGuards(AuthGuard('api-key'))
@Controller('customers')
export class CustomerSubscriptionController {
  constructor(
    private readonly customerInvoiceService: CustomersInvoiceService,
    private readonly mailer: MailerService,
  ) {}

  @Post(':customerId/subscriptions/:subscriptionId/invoices')
  @HttpCode(HttpStatus.CREATED)
  async createCustomerInvoice(
    @Param('customerId') customerId: string,
    @Param('subscriptionId') subscriptionId: number,
  ): Promise<any> {
    const invoice =
      await this.customerInvoiceService.createCustomerInvoiceExtend(
        customerId,
        subscriptionId,
      );

    return {
      title: 'Success',
      message: `invoice ${invoice.id} created successfully`,
    };
  }

  /**
   * for test email
   * @returns response
   */
  @Post('test-send')
  async sendEmail() {
    this.mailer
      .sendMail({
        to: 'rozi@nusa.net.id',
        subject: 'Invoice layanan internet',
        text: 'Pelanggan nusanet Yth.',
        html: 'Pelanggan Nusanet Yth.',
      })
      .then(() => {
        console.log('berhasil');
      })
      .catch((error) => {
        throw error;
      });

    return {
      title: 'Success',
      message: 'berhasil kirim email',
    };
  }
}
