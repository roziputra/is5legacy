import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { IPaginationOptions, paginate, paginateRaw } from 'nestjs-typeorm-paginate';
import { TicketPic } from '../entities/ticket-pic.entity';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class TicketRepository extends Repository<Ticket> {
  constructor(private dataSource: DataSource) {
    super(Ticket, dataSource.createEntityManager());
  }

  async getListTicketSurveyRepo(
    options: IPaginationOptions,
    ttsTypeIds: string[],
    ttsStatus: string[],
    surveyIds: string[],
  ): Promise<any> {
    const queryBuilder = this
    .createQueryBuilder('t')
    .leftJoinAndMapMany('t.ticketPics', TicketPic, 'tp', 't.id = tp.ticketId AND t.assignedNo = tp.assignedNo')
    .leftJoinAndMapOne('tp.employeeDetails', 'tp.employees', 'emp');
    if (ttsTypeIds.length > 0) {
      queryBuilder.where('t.ttsTypeId IN (:...ttsTypeIds)', { ttsTypeIds });
    }
    if (ttsStatus.length > 0) {
      queryBuilder.where('t.status IN (:...ttsStatus)', { ttsStatus });
    }
    if (surveyIds.length > 0) {
      queryBuilder.where('t.surveyId IN (:...surveyIds)', { surveyIds });
    }
    queryBuilder.orderBy('t.PostedTime', 'DESC');

    return paginate(queryBuilder, options);
  }
}

export const TTS_TYPE_ID_SURVEY = 5;
