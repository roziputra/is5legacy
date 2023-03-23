import { Injectable, StreamableFile } from '@nestjs/common';
import { TtbCustomerAttachmentRepository } from './stock/repositories/ttb-customer-attachment.repository';
import { createReadStream } from 'fs';
import { join } from 'path';
import { TtbCustomerRepository } from './stock/repositories/ttb-customer.repository';
import { Is5LegacyException } from './exceptions/is5-legacy.exception';

@Injectable()
export class AssetService {
  constructor(
    private readonly ttbCustomerAttachmentRepository: TtbCustomerAttachmentRepository,
    private readonly ttbCustomerRepository: TtbCustomerRepository,
  ) {}

  async getAsset(
    assetType: string,
    assetId: number,
    res,
  ): Promise<StreamableFile> {
    if (assetType == 'ttb-image') {
      const attachment = await this.ttbCustomerAttachmentRepository.findOneBy({
        id: assetId,
      });

      if (!attachment) {
        throw new Is5LegacyException('Gambar tidak ditemukan!');
      }
      const file = await createReadStream(
        join(__dirname, '..', attachment.filepath),
      );
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment',
      });
      return new StreamableFile(file);
    }

    if (assetType == 'ttb-document') {
      const ttb = await this.ttbCustomerRepository.findOneBy({
        id: assetId,
      });
      if (!ttb) {
        throw new Is5LegacyException('PDF tidak ditemukan!');
      }
      const file = await createReadStream(
        join(__dirname, '..', 'data/ttb/pdf/', `${ttb.noSurat}.pdf`),
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment',
      });
      return new StreamableFile(file);
    }
  }
}
