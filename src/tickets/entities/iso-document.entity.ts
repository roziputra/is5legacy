import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'iso_document', synchronize: false })
export class IsoDocument extends BaseEntity {
  @PrimaryGeneratedColumn()
  document_id: number;
}
