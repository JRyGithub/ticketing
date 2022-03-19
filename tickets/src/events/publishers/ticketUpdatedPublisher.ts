import { Publisher,Subjects, TicketUpdatedEvent } from "@ryweb.solutions/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}