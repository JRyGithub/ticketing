import { OrderCreatedListener } from "../orderCreatedListener"
import { natsWrapper } from "../../../natsWrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCreatedEvent, OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: `concert`,
        price: `10`,
        userId: `ads`
    })
    await ticket.save()

    const data: OrderCreatedEvent[`data`] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: `adad`,
        expiresAt: `fsdfsd`,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg}
}
it(`sets userid of the ticket`,async() => {
    const {listener,ticket,data,msg} = await setup()

    listener.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})
it(`acks message`,async() => {
    const {listener,ticket,data,msg} = await setup()

    listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})

it(`publishes an event`,async () => {
    const {listener,ticket,data,msg} = await setup()
    listener.onMessage(data,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(updatedTicket.orderId)

})