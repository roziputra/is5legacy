import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Employee', synchronize: false })
export class Employee extends BaseEntity {
  @PrimaryColumn()
  EmpId: string;

  @Column()
  EmpFName: string;

  @Column()
  EmpLName: string;

  @Column()
  EmpEmail: string;

  @Column()
  EmpJoinStatus: string;

  @Column()
  @Exclude()
  JobTitle: number;

  @Expose({ name: 'EmpFullName' })
  getFullName() {
    return `${this.EmpFName} ${this.EmpLName}`;
  }

  static GetAllEmployee() {
    return this.createQueryBuilder('Employee')
      .where('Employee.DeptId IN (:...deptIds)', { deptIds: ['01', '17'] })
      .andWhere('Employee.BranchId = :branchId', { branchId: '020' })
      .andWhere('Employee.EmpId != :empId', { empId: 'HDMEDAN' })
      .getMany();
  }
}

export const JOB_TITLE_CUSTOMER_ENGINEER = 17;
export const EMP_JOIN_STATUS_QUIT = 'QUIT';
