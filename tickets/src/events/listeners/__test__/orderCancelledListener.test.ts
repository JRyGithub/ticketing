import { natsWrapper } from "../../../natsWrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCancelledEvent } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../orderCancelledListener"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: `concert`,
        price: `10`,
        userId: `ads`
    })
    ticket.set({ orderId })
    await ticket.save()

    const data: OrderCancelledEvent[`data`] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener,ticket,orderId,data,msg}
}

it(`it updates, publishes events and acks`,async() => {
    const {listener,ticket,data,orderId,msg} = await setup()

    listener.onMessage(data,msg)

    const cancelledTicket = await Ticket.findById(ticket.id)

    expect(cancelledTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()

})