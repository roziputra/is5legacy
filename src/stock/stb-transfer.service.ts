import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import { StbEngineer } from './entities/stb-engineer.entity';
import { StbRequestRepository } from './repositories/stb-request.repository';
import { StbRequestDetailRepository } from './repositories/stb-request-detail.repository';
import { Status, TYPE_MOVED } from './entities/stb-request.entity';
import { StbEngineerDetailRepository } from './repositories/stb-engineer-detail.repository';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class StbTransferService {
  constructor(
    private readonly stbRequestRepository: StbRequestRepository,
    private readonly stbEngineerDetailRepository: StbEngineerDetailRepository,
    private readonly dataSource: DataSource,
    private readonly stbRequestDetailRepository: StbRequestDetailRepository,
  ) {}
  async confirm(id: number, status: Status, user: Employee) {
    const stbRequest = await this.stbRequestRepository.findOne({
      where: {
        id: id,
        requestType: TYPE_MOVED,
        engineer: user.EmpId,
      },
      relations: {
        details: true,
      },
    });

    if (!stbRequest) {
      throw new Is5LegacyException(
        'Permintaan pindah tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      stbRequest.status = status;
      const stbRequestSaved = await transaction.manager.save(stbRequest);
      const stbEngineer = new StbEngineer();
      stbEngineer.requestId = id;
      stbEngineer.engineer = stbRequest.engineer;
      stbEngineer.branchId = stbRequest.branchId;
      stbEngineer.requestType = TYPE_MOVED;
      stbEngineer.approvedBy = user.EmpId;
      stbEngineer.approvedDate = new Date();
      stbEngineer.description = stbRequest.description;
      stbEngineer.createdBy = user.EmpId;
      const stbEngineerSaved = await transaction.manager.save(stbEngineer);

      const details = this.stbEngineerDetailRepository.create(
        stbRequest.details,
      );

      const stbEngineerDetail = details.map((i) => {
        delete i.id;
        i.stbEngineerId = stbEngineerSaved.id;
        return i;
      });

      await transaction.manager.save(stbEngineerDetail);

      await transaction.commitTransaction();
      return stbRequestSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal konfirmasi permintaan pindah');
    } finally {
      await transaction.release();
    }
  }

  findOne(id: number) {
    return this.stbRequestRepository.findOneStbTransfer(id);
  }
}
