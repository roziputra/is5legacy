import { Controller, Get, Param, Res } from '@nestjs/common';
import { TtbCustomerService } from './ttb-customer.service';
import { ConfigService } from '@nestjs/config';
import { TtbCustomerDetailService } from './ttb-customer-detail.service';
import { DateFormat } from 'src/utils/date-format';

@Controller('v1/stock/ttb/:id/pdf')
export class TtbPdfController {
  constructor(
    private readonly ttbCustomerService: TtbCustomerService,
    private readonly ttbCustomerDetailService: TtbCustomerDetailService,
    private readonly configService: ConfigService,
  ) {}

  /** dikomen sementara karena mau cari bugs */
  @Get()
  async index(@Param('id') id: number, @Res() res): Promise<void> {
    const buffer = await this.ttbCustomerService.createPdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ttb.pdf',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get('view')
  async generatePdf(@Param('id') id: number, @Res() res): Promise<void> {
    const frontEndUrl = `${this.configService.get('FRONTEND_URL')}`;
    const ttb = await this.ttbCustomerService.findOneTtb(id);
    const details =
      await this.ttbCustomerDetailService.findAllTtbCustomerDetails(id);

    const d = new DateFormat(ttb.date);
    return res.render('stock/ttb-template', {
      frontEndUrl: frontEndUrl,
      ttb: ttb,
      details: details,
      ttbDate: d.toLongDateFormat(),
    });
  }
}
