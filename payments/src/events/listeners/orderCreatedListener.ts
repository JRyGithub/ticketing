import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@ryweb.solutions/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName: string = queueGroupName
    async onMessage(data: OrderCreatedEvent[`data`], msg: Message) {
        //Find ticket reserving
        const ticket = await  Ticket.findById(data.ticket.id)
        //Throw not found if not present
        if(!ticket) throw new NotFoundError()
        //Mark as reserved with orderid
        ticket.set({orderId: data.id})
        //save and ack
        ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })

        msg.ack()
    }
}