import { Expose } from 'class-transformer';

export class EmployeeApiResource {
  @Expose({ name: 'employee_id' })
  EmpId: string;

  @Expose({ name: 'first_name' })
  EmpFName: string;

  @Expose({ name: 'last_name' })
  EmpLName: string;

  @Expose()
  email: string;

  @Expose({ name: 'join_status' })
  joinStatus: string;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose({ name: 'display_branch_id' })
  displayBranchId: string;

  @Expose({ name: 'department_id' })
  departmentId: string;

  @Expose({ name: 'full_name' })
  getFullName() {
    return `${this.EmpFName} ${this.EmpLName}`;
  }
}
