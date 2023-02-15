import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StbEngineer } from './stb-engineer.entity';

@Entity({ name: 'stb_engineer_barang', synchronize: false })
export class StbEngineerBarang extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stb_engineer_id' })
  stbEngineerId: number;

  @Column()
  serial: string;

  @Column()
  code: string;

  @Column()
  qty: number;

  @ManyToOne(type => StbEngineer)
  @JoinColumn({ name: 'stb_engineer_id' })
  stbEngineer: StbEngineer
}
