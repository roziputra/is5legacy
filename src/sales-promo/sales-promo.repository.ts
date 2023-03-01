import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SalesPromo } from './sales-promo.entity';
import { GetPromoFilterDto } from './dto/get-promo-filter.dto';
import { Is5LegacyException } from '../exceptions/is5-legacy.exception';

@Injectable()
export class SalesPromoRepository extends Repository<SalesPromo> {
  constructor(private dataSource: DataSource) {
    super(SalesPromo, dataSource.createEntityManager());
  }

  async getListPromoRepository(
    filterPromoDto: GetPromoFilterDto,
  ): Promise<any> {
    const { startDate, endDate, branchIds, isActive } = filterPromoDto;

    const queryBuilder = this.createQueryBuilder('sp').select([
      'sp.id id',
      'sp.branchId branch_id',
      'sp.nama_promo promo_name',
      'sp.from promo_start_date',
      'sp.to promo_end_date',
      'sp.description promo_description',
      'sp.active promo_status',
      'sp.inserttime created_at',
      'sp.insertby created_by',
    ]);

    const isStartDate =
      typeof startDate !== 'undefined' && startDate.trim().length > 0
        ? true
        : false;
    const isEndDate =
      typeof endDate !== 'undefined' && endDate.trim().length > 0
        ? true
        : false;

    if (isStartDate && isEndDate) {
      queryBuilder.andWhere('sp.from >= :startDate AND sp.to <= :endDate', {
        startDate: startDate,
        endDate: endDate,
      });
    } else if (isStartDate) {
      queryBuilder.andWhere('sp.from >= :startDate', {
        startDate: startDate,
      });
    } else if (isEndDate) {
      queryBuilder.andWhere('sp.to <= :endDate', {
        endDate: endDate,
      });
    }

    if (
      typeof branchIds !== 'undefined' && branchIds.length > 0 ? true : false
    ) {
      queryBuilder.andWhere('sp.branchId IN (:...branchIds)', {
        branchIds: branchIds,
      });
    }

    if (
      typeof isActive !== 'undefined' && isActive.trim().length > 0
        ? true
        : false
    ) {
      queryBuilder.andWhere('(sp.active = :active)', {
        active: isActive,
      });
    }

    const resultQuery = await queryBuilder
      .orderBy('sp.inserttime', 'DESC')
      .getRawMany();

    if (resultQuery.length == 0) {
      throw new Is5LegacyException(
        'Data promo tidak ditemukan. silahkan coba lagi!',
        404,
      );
    }

    return resultQuery;
  }

  async getListPromoByIdRepository(promoIds: string[]): Promise<any> {
    const queryBuilder = await this.createQueryBuilder('sp')
      .select([
        'sp.id id',
        'sp.branchId branch_id',
        'sp.nama_promo promo_name',
        'sp.from promo_start_date',
        'sp.to promo_end_date',
        'sp.description promo_description',
        'sp.active promo_status',
        'sp.inserttime created_at',
        'sp.insertby created_by',
      ])
      .where('sp.id IN (:...promoIds)', { promoIds: promoIds })
      .orderBy('sp.id', 'ASC')
      .getRawMany();

    if (queryBuilder.length == 0) {
      throw new Is5LegacyException(
        'Data promo tidak ditemukan. silahkan coba lagi!',
        404,
      );
    }

    return queryBuilder;
  }
}
