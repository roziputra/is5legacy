import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'GeneralTickets', synchronize: false })
export class GeneralTicket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  pid: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  empId: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  custId: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  timeCreated: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  timeStart: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  timeExpired: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  statusId: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  progress: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  priorityId: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  assignNo: number;

  @IsNotEmpty()
  @IsNumber()
  sourceId: number;

  @IsNotEmpty()
  @IsNumber()
  private: number;
}
