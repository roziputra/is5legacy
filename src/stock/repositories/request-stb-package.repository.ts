import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RequestStbPackage } from '../entities/request-stb-package.entity';

@Injectable()
export class RequestStbPackageRepository extends Repository<RequestStbPackage> {
  constructor(private dataSource: DataSource) {
    super(RequestStbPackage, dataSource.createEntityManager());
  }
}
