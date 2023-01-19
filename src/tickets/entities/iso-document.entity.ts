import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'iso_document', synchronize: false })
export class IsoDocument extends BaseEntity {
  @PrimaryColumn()
  document_id: number;
}
