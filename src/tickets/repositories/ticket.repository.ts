import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { IPaginationOptions, paginateRaw } from 'nestjs-typeorm-paginate';

@Injectable()
export class TicketRepository extends Repository<Ticket> {
  constructor(private dataSource: DataSource) {
    super(Ticket, dataSource.createEntityManager());
  }

  async getListTicketSurveyRepo(
    options: IPaginationOptions,
    surveyIds: string[],
    ttsTypeIds: string[],
  ): Promise<any> {
    const queryBuilder = this.createQueryBuilder('t')
      .select([
        't.TtsId survey_id',
        't.CustId customer_id',
        't.CustServId customer_service_id',
        't.AssignedNo survey_assigned_number',
        't.Status survey_status',
        't.LockedBy survey_locked_by',
        't.VisitTime survey_visit_time',
        'tp.EmpId surveyor_employee_id',
        "CONCAT(e.EmpFName, ' ', e.EmpLName) surveyor_employee_name",
      ])
      .innerJoin(
        'TtsPIC',
        'tp',
        't.TtsId = tp.TtsId AND t.AssignedNo = tp.AssignedNo',
      )
      .innerJoin('Employee', 'e', 'tp.EmpId = e.EmpId');

    if (ttsTypeIds.length > 0) {
      queryBuilder.where('t.TtsTypeId IN (:...ttsTypeId)', {
        ttsTypeId: ttsTypeIds,
      });
    }

    if (surveyIds.length > 0) {
      queryBuilder.andWhere('t.TtsId IN (:...surveyIds)', {
        surveyIds: surveyIds,
      });
    }
    queryBuilder.orderBy('t.PostedTime', 'DESC');

    const paginateResults = await paginateRaw(queryBuilder, options);
    const newPaginationResult = {
      data: paginateResults.items,
      meta: paginateResults.meta,
      links: paginateResults.links,
    };

    return newPaginationResult;
  }

  async updateTicketSurvey(ticketId: string, tickets: Ticket): Promise<any> {
    const findSurveyTicket = await this.findOne({
      where: { id: parseInt(ticketId) },
    });
    findSurveyTicket.CustomerId = tickets.CustomerId;
    findSurveyTicket.customerServiceId = tickets.customerServiceId;
    return await this.save(findSurveyTicket);
  }
}

export const TTS_TYPE_ID_SURVEY = 5;
