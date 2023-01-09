import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

type ticketType = 'employee' | 'group';

@Entity({ name: 'GeneralTicketPIC2', synchronize: false })
export class TicketPic extends BaseEntity {
  @PrimaryColumn()
  ticketId: number;

  @Column()
  assignNo: number;

  @Column()
  type: ticketType;

  @Column()
  typeId: string;
}
