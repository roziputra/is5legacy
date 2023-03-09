import { Injectable } from '@nestjs/common';
import { GetServiceFilterDto } from './dto/get-service-filter.dto';
import { Services } from './entities/service.entity';
import { Is5LegacyException } from '../exceptions/is5-legacy.exception';

@Injectable()
export class ServicesService {
  async getAllServicesService(
    filterServiceDto: GetServiceFilterDto,
  ): Promise<any> {
    const { branchIds, serviceIds } = filterServiceDto;

    const queryBuilder = Services.createQueryBuilder('s').select([
      's.ServiceId service_id',
      's.ServiceType service_type',
      's.ServiceLevel service_level',
      'IFNULL(s.ChargePerPeriod, s.ServiceCharge) service_charge',
      'IFNULL(sd.discontinue, 0) discontinue',
    ]);

    if (branchIds.length == 0) {
      queryBuilder.leftJoin(
        'ServiceDiscontinue',
        'sd',
        's.ServiceId = sd.ServiceId',
      );
    } else {
      queryBuilder.leftJoin(
        'ServiceDiscontinue',
        'sd',
        's.ServiceId = sd.ServiceId AND sd.BranchId IN (:...branchIds)',
        { branchIds: branchIds },
      );
    }

    queryBuilder
      .leftJoin('ServiceGroup', 'sg', 's.ServiceGroup = sg.ServiceGroup')
      .leftJoin('ServiceGroupType', 'sgt', 'sg.ServiceGroupTypeId = sgt.id')
      .leftJoin('ServiceShaping', 'ss', 's.ServiceId = ss.ServiceId')
      .where(
        "(sd.discontinue IS NULL or sd.discontinue = 0) AND sg.ServiceGroupTypeId = 1 AND s.ServiceGroup != 'WR'",
      );

    if (serviceIds.length > 0) {
      queryBuilder.andWhere('s.ServiceId IN (:...serviceIds)', {
        serviceIds: serviceIds,
      });
    }

    const resultQuery = await queryBuilder
      .orderBy('s.ServiceType', 'ASC')
      .getRawMany();

    if (resultQuery.length == 0) {
      throw new Is5LegacyException(
        'Data layanan tidak ditemukan. silahkan coba lagi',
        404,
      );
    }

    return resultQuery;
  }
}
