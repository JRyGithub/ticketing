import { Publisher,Subjects,TicketCreatedEvent } from "@ryweb.solutions/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}