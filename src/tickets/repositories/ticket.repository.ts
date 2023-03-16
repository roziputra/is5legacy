import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { IPaginationOptions, paginateRaw } from 'nestjs-typeorm-paginate';
import { UpdateSurveyTicketDto } from '../dto/update-ticket.dto';
import { TicketUpdate } from '../entities/ticket-update.entity';
import { Is5LegacyException } from '../../exceptions/is5-legacy.exception';

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

  async updateTicketSurveyRepo(
    ticketId: string,
    updateTicketSurveyDto: UpdateSurveyTicketDto,
  ): Promise<any> {
    // find the ticket
    const findSurveyTicket = await this.findOne({
      where: { id: parseInt(ticketId) },
    });
    findSurveyTicket.CustomerId = updateTicketSurveyDto.customer_id;
    findSurveyTicket.customerServiceId =
      updateTicketSurveyDto.customer_service_id;
    const resultSave = await Ticket.save(findSurveyTicket);

    // save the ticket update
    if (resultSave) {
      const newTicketUpdated = new TicketUpdate();
      newTicketUpdated.ttsId = parseInt(ticketId);
      newTicketUpdated.updatedTime = new Date();
      newTicketUpdated.actionStart = new Date();
      newTicketUpdated.actionBegin = new Date();
      newTicketUpdated.actionEnd = new Date();
      newTicketUpdated.actionStop = new Date();
      newTicketUpdated.employeeId = 'SYSTEM';
      newTicketUpdated.action = 'Update customer id dan customer service id';
      newTicketUpdated.note = '';
      newTicketUpdated.assignedNo = findSurveyTicket.assignedNo;
      newTicketUpdated.status = findSurveyTicket.status;
      newTicketUpdated.lockedBy = findSurveyTicket.lockedBy;
      newTicketUpdated.visitTime = findSurveyTicket.visitTime;
      const resultSaveTicketUpdate = await TicketUpdate.save(newTicketUpdated);

      if (resultSaveTicketUpdate) {
        return {
          title: 'Berhasil',
          message: 'Berhasil merubah ticket survey',
        };
      } else {
        throw new Is5LegacyException(
          'Gagal merubah ticket survey. silahkan coba lagi',
          500,
        );
      }
    }

    return findSurveyTicket;
  }
}

export const TTS_TYPE_ID_SURVEY = 5;
