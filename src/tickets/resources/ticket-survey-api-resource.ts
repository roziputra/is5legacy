import { Exclude, Expose, Type } from "class-transformer";
import { EmployeeApiResource } from "src/employees/resources/employee-api-resource";
import { TicketPicResource } from "./ticket-pic-api-resource";

export class TicketSurveyApiResource {
    @Expose({ name: 'id' })
    id: string;

    @Expose({ name: 'customer_id' })
    CustomerId: string;
    
    @Expose({ name: 'customer_service_id' })
    customerServiceId: string;

    @Expose({ name: 'status' })
    status: string;

    @Exclude()
    @Type(() => TicketPicResource)
    ticketPics: TicketPicResource[];

    @Expose({ name: 'ticket_pics' })
    getTicketPicsDetails() {
        return this.ticketPics.map(ticketPic => ticketPic.employeeDetails);
    }
}