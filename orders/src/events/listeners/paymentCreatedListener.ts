import { Subjects,PaymentCreatedEvent, OrderStatus, NotFoundError } from "@ryweb.solutions/common";
import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName: string = queueGroupName
    async onMessage(data: PaymentCreatedEvent[`data`],msg: Message){
        const { orderId, stripeId, id } = data
        
        const order = await Order.findById(orderId)
        if(!order) throw new NotFoundError()

        order.set({
            status: OrderStatus.Complete
        })

        await order.save()

        msg.ack()

    }
}