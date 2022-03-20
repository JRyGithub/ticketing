import { Subjects,TicketCreatedEvent } from "@ryweb.solutions/common";
import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName: string = queueGroupName
    async onMessage(data: TicketCreatedEvent[`data`],msg: Message){
        const { title, price, id } = data
        const ticket = Ticket.build({
            title,price,id
        })
        await ticket.save()

        msg.ack()

    }
}