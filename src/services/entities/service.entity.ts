import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Services', { synchronize: false })
export class Services extends BaseEntity {
  @PrimaryColumn({ name: 'ServiceId' })
  id: string;

  @Column()
  ServiceLevel: string;

  @Column()
  ServiceType: string;

  @Column()
  ServiceCharge: number;

  @Column()
  ServiceAdditionalCharge: number;

  @Column()
  ServiceGroup: string;

  @Column()
  FreeAccess: number;

  @Column()
  ServiceChargeLampung: number;

  @Column()
  ServiceAddChargeLampung: number;
  @Column()
  FreeAccessLampung: number;

  @Column()
  ServiceChargeJakarta: number;

  @Column()
  ServiceAddChargeJakarta: number;

  @Column()
  FreeAccessJakarta: number;
}
