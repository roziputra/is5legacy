import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IsoDocument } from '../entities/iso-document.entity';

@Injectable()
export class IsoDocumentRepository extends Repository<IsoDocument> {
  constructor(private dataSource: DataSource) {
    super(IsoDocument, dataSource.createEntityManager());
  }
  getWhenEffectiveUntil(dateEffectiveUntil: string) {
    return IsoDocument.createQueryBuilder()
      .select(['document_name', 'document_id', 'effective_until'])
      .where('status = :status', { status: ISO_DOCUMENT_STATUS_APPROVED })
      .andWhere('effective_until = :effectiveUntil', {
        effectiveUntil: dateEffectiveUntil,
      })
      .getRawMany();
  }

  getWhenEffectiveUntilBetween(dateFrom: string, dateTo: string) {
    return IsoDocument.createQueryBuilder()
      .select(['document_name', 'document_id', 'effective_until'])
      .where('status = :status', { status: ISO_DOCUMENT_STATUS_APPROVED })
      .andWhere('effective_until >= :dateFrom', {
        dateFrom: dateFrom,
      })
      .andWhere('effective_until <= :dateTo', {
        dateTo: dateTo,
      })
      .getRawMany();
  }
}

export const ISO_DOCUMENT_STATUS_APPROVED = 'approved';
