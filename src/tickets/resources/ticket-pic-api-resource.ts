import { Expose, Type } from "class-transformer";
import { EmployeeApiResource } from "src/employees/resources/employee-api-resource";

export class TicketPicResource {
    @Expose({ name: 'id' })
    ticketId: string;
    
    @Expose({ name: 'employee_id' })
    employeeId: string;
    
    @Expose({ name: 'assigned_no' })
    assignedNo: string;
    
    @Expose({ name: 'employee_details' })
    @Type(() => EmployeeApiResource)
    employeeDetails: EmployeeApiResource[];
}