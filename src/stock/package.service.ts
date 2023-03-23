import { Injectable } from '@nestjs/common';
import { RequestStbPackageRepository } from './repositories/request-stb-package.repository';
import { RequestStbPackage } from './entities/request-stb-package.entity';
import { RequestStbPackageDetailRepository } from './repositories/request-stb-package-detail.repository';
import { StbEngineerService } from './stb-engineer.service';

@Injectable()
export class PackageService {
  constructor(
    private readonly stbEngineerService: StbEngineerService,
    private readonly requestStbPackageRepository: RequestStbPackageRepository,
    private readonly requestStbPackageDetailRepository: RequestStbPackageDetailRepository,
  ) {}

  findPackages(user): Promise<RequestStbPackage[]> {
    const branch = this.stbEngineerService.getMasterBranch(user);
    return this.requestStbPackageRepository.findAllPackage(branch);
  }

  findPackageDetails(id: number, branch: string) {
    return this.requestStbPackageDetailRepository.findPackageDetails(
      id,
      branch,
    );
  }
}
