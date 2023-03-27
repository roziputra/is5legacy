import { Exclude, Expose } from 'class-transformer';

export class LiteEmployeeApiResource {
  @Expose({ name: 'id' })
  EmpId: string;

  @Exclude()
  EmpFName: string;

  @Exclude()
  EmpLName: string;

  @Expose({ name: 'name' })
  getName(): string {
    return `${this.EmpFName} ${this.EmpLName}`;
  }
}
