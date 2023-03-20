import { Exclude, Expose, Type } from 'class-transformer';
import { EmployeeApiResource } from 'src/employees/resources/employee-api-resource';
import { RequestType } from '../entities/stb-request.entity';
import { StbApiResource } from './stb-api-resource';

export class StbTranferCollectionApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'transfer_type' })
  transferType: string;

  @Exclude()
  eng_EmpId: string;

  @Exclude()
  eng_EmpFName: string;

  @Exclude()
  eng_EmpLName: string;

  @Expose({ name: 'engineer' })
  getEngineer() {
    return {
      id: this.eng_EmpId,
      name: `${this.eng_EmpFName} ${this.eng_EmpLName}`,
    };
  }

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @Expose({ name: 'request_date' })
  requestDate: Date;

  @Expose()
  status: string;

  @Exclude()
  rej_EmpId: string;

  @Exclude()
  rej_EmpFName: string;

  @Exclude()
  rej_EmpLName: string;

  @Expose({ name: 'rejected_by' })
  getRejectedBy() {
    if (!this.rej_EmpId) return null;
    return {
      id: this.rej_EmpId,
      name: `${this.rej_EmpFName} ${this.rej_EmpLName}`,
    };
  }

  @Expose({ name: 'rejected_reason' })
  rejectedReason: string;

  @Expose()
  description: string;

  @Exclude()
  cre_EmpId: string;

  @Exclude()
  cre_EmpFName: string;

  @Exclude()
  cre_EmpLName: string;

  @Expose({ name: 'created_by' })
  getCreatedBy() {
    return {
      id: this.cre_EmpId,
      name: `${this.cre_EmpFName} ${this.cre_EmpLName}`,
    };
  }

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  stb_id: number;

  @Exclude()
  stb_approvedDate: Date;

  @Exclude()
  stb_app_EmpId;

  @Exclude()
  stb_app_EmpFName;

  @Exclude()
  stb_app_EmpLName;

  getApprovedBy() {
    return {
      id: this.stb_app_EmpId,
      name: `${this.stb_app_EmpFName} ${this.stb_app_EmpLName}`,
    };
  }

  @Expose({ name: 'stb' })
  getStb() {
    if (!this.stb_id) return null;
    return {
      id: this.stb_id,
      approved_date: this.stb_approvedDate,
      approved_by: this.getApprovedBy(),
    };
  }
}
