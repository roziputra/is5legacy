import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sms_phonebook', synchronize: false })
export class SMSPhonebook extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  custId: string;

  @Column()
  billing: boolean;

  @Column()
  technical: boolean;

  @CreateDateColumn()
  insertTime: Date;

  @Column()
  insertBy: string;
}
