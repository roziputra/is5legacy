import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tapi_call_salutation', synchronize: false })
export class CustomerSalutation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salutation: string;

  @Column()
  status: string;
}
