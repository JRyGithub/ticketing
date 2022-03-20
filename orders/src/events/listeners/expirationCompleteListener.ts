import { ExpirationCompleteEvent, NotFoundError, OrderStatus, Subjects } from "@ryweb.solutions/common";
import Listener from "@ryweb.solutions/common/build/events/baseListener";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { natsWrapper } from "../../natsWrapper";
import { OrderCancelledPublisher } from "../publishers/orderCancelledPublisher";
import { queueGroupName } from "./queueGroupName";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
    queueGroupName: string = queueGroupName

    async onMessage(data: ExpirationCompleteEvent[`data`], msg: Message){
        const order = await Order.findById(data.orderId).populate(`ticket`)
        if(!order) throw new NotFoundError()

        order.set({ status: OrderStatus.Cancelled})
        await order.save()
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()
    }
}