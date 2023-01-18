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

      for (let idx_branch = 0; idx_branch < branch_ids.length; idx_branch++) {
        const branchNumber = branch_ids[idx_branch];
        resultDataFetchService[idx_branch] = await this.getServicesByBranchID(
          branchNumber,
        );
        for (
          let idx_data = 0;
          idx_data < resultDataFetchService[idx_branch].length;
          idx_data++
        ) {
          newResultDataFetchService[idx] =
            resultDataFetchService[idx_branch][idx_data];
          if (
            this.isNumeric(
              resultDataFetchService[idx_branch][idx_data].service_charge,
            )
          ) {
            resultDataFetchService[idx_branch][idx_data].service_charge =
              parseInt(
                resultDataFetchService[idx_branch][idx_data].service_charge,
              );
          } else {
            const servicePriceObj = JSON.parse(
              resultDataFetchService[idx_branch][idx_data].service_charge,
            );
            for (const key in servicePriceObj) {
              resultDataFetchService[idx_branch][idx_data].service_charge =
                servicePriceObj[key] / parseInt(key);
            }
            resultDataFetchService[idx_branch][idx_data].service_charge =
              parseInt(
                resultDataFetchService[idx_branch][idx_data].service_charge,
              );
          }
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

      for (let idx_branch = 0; idx_branch < branch_ids.length; idx_branch++) {
        const branchNumber = branch_ids[idx_branch];
        resultDataFetchService[idx_branch] = await this.getServicesByBranchID(
          branchNumber,
        );
        for (
          let idx_data = 0;
          idx_data < resultDataFetchService[idx_branch].length;
          idx_data++
        ) {
          newResultDataFetchService[idx] =
            resultDataFetchService[idx_branch][idx_data];
          if (
            this.isNumeric(
              resultDataFetchService[idx_branch][idx_data].service_charge,
            )
          ) {
            resultDataFetchService[idx_branch][idx_data].service_charge =
              parseInt(
                resultDataFetchService[idx_branch][idx_data].service_charge,
              );
          } else {
            const servicePriceObj = JSON.parse(
              resultDataFetchService[idx_branch][idx_data].service_charge,
            );
            for (const key in servicePriceObj) {
              resultDataFetchService[idx_branch][idx_data].service_charge =
                servicePriceObj[key] / parseInt(key);
            }
            resultDataFetchService[idx_branch][idx_data].service_charge =
              parseInt(
                resultDataFetchService[idx_branch][idx_data].service_charge,
              );
          }
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

    for (let idx_branch = 0; idx_branch < branch_ids.length; idx_branch++) {
      const branchNumber = branch_ids[idx_branch];
      resultDataFetchService[idx_branch] = await this.getServicesByBranchID(
        branchNumber,
      );
      for (
        let idx_data = 0;
        idx_data < resultDataFetchService[idx_branch].length;
        idx_data++
      ) {
        newResultDataFetchService[idx] =
          resultDataFetchService[idx_branch][idx_data];
        if (
          this.isNumeric(
            resultDataFetchService[idx_branch][idx_data].service_charge,
          )
        ) {
          resultDataFetchService[idx_branch][idx_data].service_charge =
            parseInt(
              resultDataFetchService[idx_branch][idx_data].service_charge,
            );
        } else {
          const servicePriceObj = JSON.parse(
            resultDataFetchService[idx_branch][idx_data].service_charge,
          );
          for (const key in servicePriceObj) {
            resultDataFetchService[idx_branch][idx_data].service_charge =
              servicePriceObj[key] / parseInt(key);
          }
          resultDataFetchService[idx_branch][idx_data].service_charge =
            parseInt(
              resultDataFetchService[idx_branch][idx_data].service_charge,
            );
        }
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
        'IFNULL(s.ChargePerPeriod, s.ServiceCharge) service_charge',
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

  isNumeric(num) {
    return !isNaN(num);
  }
}
