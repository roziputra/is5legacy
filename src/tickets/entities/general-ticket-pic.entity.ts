import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'GeneralTicketPIC2', synchronize: false })
export class GeneralTicketPic extends BaseEntity {
  @PrimaryColumn()
  ticketId: number;

  @Column()
  assignNo: number;

  @Column()
  type: TicketType;

  @Column()
  typeId: string;
}

export type TicketType = typeof TICKET_TYPE_EMPLOYEE | typeof TICKET_TYPE_GROUP;
export const TICKET_TYPE_EMPLOYEE = 'employee';
export const TICKET_TYPE_GROUP = 'group';
