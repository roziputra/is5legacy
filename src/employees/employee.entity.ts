import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Employee', synchronize: false })
export class Employee extends BaseEntity {
  @PrimaryColumn()
  @Expose({ name: 'employee_id' })
  EmpId: string;

  @Column()
  @Expose({ name: 'first_name' })
  EmpFName: string;

  @Column()
  @Expose({ name: 'last_name' })
  EmpLName: string;

  @Column({ name: 'EmpEmail' })
  email: string;

  @Column({ name: 'EmpJoinStatus' })
  @Expose({ name: 'join_status' })
  joinStatus: string;

  @Column({ name: 'BranchId' })
  @Expose({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'DeptId' })
  @Expose({ name: 'department_id' })
  departmentId: string;

  @Column({ name: 'DisplayBranchId' })
  @Expose({ name: 'display_branch_id' })
  displayBranchId: string;

  @Column()
  @Exclude()
  jobTitle: number;

  @Expose({ name: 'full_name' })
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
