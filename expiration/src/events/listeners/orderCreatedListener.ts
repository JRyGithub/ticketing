import { OrderCreatedEvent, OrderStatus, Subjects } from "@ryweb.solutions/common";
import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expirationQueue";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName: string = queueGroupName

    async onMessage(data: OrderCreatedEvent[`data`], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        })
        msg.ack
    }
}