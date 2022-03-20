import { Subjects, TicketUpdatedEvent } from "@ryweb.solutions/common";
import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName: string = queueGroupName
    async onMessage(data: TicketUpdatedEvent[`data`],msg: Message){
        const ticket = await Ticket.findByEvent(data)

        if(!ticket) throw new Error(`Ticket not found`)
        const { title,price } = data
        ticket.set({ title, price})
        await ticket.save()
        msg.ack()

    }
}