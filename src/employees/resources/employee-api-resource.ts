import { Exclude, Expose } from 'class-transformer';

export class EmployeeApiResource {
  @Expose({ name: 'id' })
  EmpId: string;

  @Expose({ name: 'first_name' })
  @Exclude()
  EmpFName: string;

  @Expose({ name: 'last_name' })
  @Exclude()
  EmpLName: string;

  @Expose({ name: 'name' })
  getName(): string {
    return `${this.EmpFName} ${this.EmpLName}`;
  }
}
