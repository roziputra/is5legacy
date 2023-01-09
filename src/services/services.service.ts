import { Injectable } from '@nestjs/common';
import { GetServiceFilterDto } from './dto/get-service-filter.dto';
import { Services } from './entities/service.entity';

@Injectable()
export class ServicesService {
  async getAllServicesService(
    filterServiceDto: GetServiceFilterDto,
  ): Promise<any> {
    const { branch_ids } = filterServiceDto;

    if (branch_ids) {
      const resultDataFetchService = [];
      const newResultDataFetchService = [];
      let idx = 0;

      for (let a = 0; a < branch_ids.length; a++) {
        const branchNumber = branch_ids[a];
        resultDataFetchService[a] = await this.getServicesByBranchID(
          branchNumber,
        );
        for (let b = 0; b < resultDataFetchService[a].length; b++) {
          newResultDataFetchService[idx] = resultDataFetchService[a][b];
          idx++;
        }
      }

      const filteredArr = newResultDataFetchService.reduce((acc, current) => {
        const x = acc.find((item) => item.service_id === current.service_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      return filteredArr;
    } else {
      const branch_ids = ['020', '062'];
      const resultDataFetchService = [];
      const newResultDataFetchService = [];
      let idx = 0;

      for (let a = 0; a < branch_ids.length; a++) {
        const branchNumber = branch_ids[a];
        resultDataFetchService[a] = await this.getServicesByBranchID(
          branchNumber,
        );
        for (let b = 0; b < resultDataFetchService[a].length; b++) {
          newResultDataFetchService[idx] = resultDataFetchService[a][b];
          idx++;
        }
      }

      const filteredArr = newResultDataFetchService.reduce((acc, current) => {
        const x = acc.find((item) => item.service_id === current.service_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      return filteredArr;
    }
  }

  async getServicesByIDService(service_id: string) {
    const branch_ids = ['020', '062'];
    const resultDataFetchService = [];
    const newResultDataFetchService = [];
    let idx = 0;

    for (let a = 0; a < branch_ids.length; a++) {
      const branchNumber = branch_ids[a];
      resultDataFetchService[a] = await this.getServicesByBranchID(
        branchNumber,
      );
      for (let b = 0; b < resultDataFetchService[a].length; b++) {
        newResultDataFetchService[idx] = resultDataFetchService[a][b];
        idx++;
      }
    }

    const filteredArr = newResultDataFetchService.reduce((acc, current) => {
      const x = acc.find((item) => item.service_id === current.service_id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const result = [];
    let resultIDX = 0;
    for (let index = 0; index < filteredArr.length; index++) {
      const element = filteredArr[index];
      if (element.service_id == service_id) {
        result[resultIDX] = element;
        resultIDX++;
      }
    }

    return result[0];
  }

  async getServicesByBranchID(branch_id: string) {
    return await Services.createQueryBuilder('s')
      .select([
        's.ServiceId service_id',
        's.ServiceType service_type',
        's.ServiceLevel service_level',
        'ss.NormalDownCeil normal_down_ceil',
        'ss.NormalDownRate normal_down_rate',
        'ss.NormalUpCeil normal_up_ceil',
        'ss.NormalUpRate normal_up_rate',
        '(s.MaxDownTime / 3600) down_time',
        's.ServiceCharge service_charge',
        'IFNULL(sd.discontinue, 0) discontinue',
      ])
      .leftJoin(
        'ServiceDiscontinue',
        'sd',
        's.ServiceId = sd.ServiceId AND sd.BranchId = :branch_id',
        { branch_id: branch_id },
      )
      .leftJoin('ServiceGroup', 'sg', 's.ServiceGroup = sg.ServiceGroup')
      .leftJoin('ServiceGroupType', 'sgt', 'sg.ServiceGroupTypeId = sgt.id')
      .leftJoin('ServiceShaping', 'ss', 's.ServiceId = ss.ServiceId')
      .where(
        "(sd.discontinue IS NULL or sd.discontinue = 0) AND sg.ServiceGroupTypeId = 1 AND s.ServiceGroup != 'WR'",
      )
      .orderBy('s.ServiceType')
      .getRawMany();
  }
}
