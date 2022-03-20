import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from "@ryweb.solutions/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName: string = queueGroupName
    async onMessage(data: OrderCancelledEvent[`data`], msg: Message) {
        const ticket = await  Ticket.findById(data.ticket.id)
        if(!ticket) throw new NotFoundError()
        ticket.set({orderId: undefined})
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