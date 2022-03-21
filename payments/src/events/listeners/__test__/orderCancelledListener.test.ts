import { natsWrapper } from "../../../natsWrapper"
import { OrderCancelledEvent, OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../orderCancelledListener"
import { Order } from "../../../models/order"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: orderId,
        status: OrderStatus.Created,
        price: `10`,
        userId: `jsnjfa`,
        version: 0,
    })
    order.save()

    const data: OrderCancelledEvent[`data`] = {
        id: order.id,
        version: 1,
        ticket: {
            id: `fsdmdsa`,
        },
    }

    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener,order,data,msg}
}

it(`it updates, publishes events and acks`,async() => {
    const {listener,data,order,msg} = await setup()

    await listener.onMessage(data,msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it(`acks message`,async() => {
    const {listener,data,order,msg} = await setup()

    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()

})