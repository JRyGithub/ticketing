import { OrderCreatedListener } from "../orderCreatedListener"
import { natsWrapper } from "../../../natsWrapper"
import { OrderCreatedEvent, OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent[`data`] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: `adad`,
        expiresAt: `fsdfsd`,
        ticket: {
            id: `kfsdd` ,
            price: `10`,
        },
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener,data,msg}
}
it(`replicates the order info`,async() => {
    const {listener,data,msg} = await setup()

    listener.onMessage(data,msg)

    const order = await Order.findById(data.id)

    expect(order!.price).toEqual(data.ticket.price)

    
})
it(`acks message`,async() => {
    const {listener,data,msg} = await setup()

    listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
    
})