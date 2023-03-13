import { Injectable } from '@nestjs/common';
import { RequestStbPackageRepository } from './repositories/request-stb-package.repository';
import { RequestStbPackage } from './entities/request-stb-package.entity';
import { RequestStbPackageDetailRepository } from './repositories/request-stb-package-detail.repository';

@Injectable()
export class PackageService {
  constructor(
    private readonly requestStbPackageRepository: RequestStbPackageRepository,
    private readonly requestStbPackageDetailRepository: RequestStbPackageDetailRepository,
  ) {}

  findPackages(): Promise<RequestStbPackage[]> {
    return this.requestStbPackageRepository.findAllPackage();
  }

  findPackageDetails(id: number, branch: string) {
    return this.requestStbPackageDetailRepository.findPackageDetails(
      id,
      branch,
    );
  }
}
