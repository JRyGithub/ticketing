import { natsWrapper } from '../../../natsWrapper'
import { ExpirationCompleteListener } from '../expirationCompleteListener'
import { ExpirationCompleteEvent, OrderStatus, TicketCreatedEvent } from '@ryweb.solutions/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'

const setup = async() => {
    //Create Listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: `test`,
        price: `20`
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Created,
        userId: `fsdjknnf`,
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    const data: ExpirationCompleteEvent[`data`] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener,data,msg,order,ticket }
}


it(`updates to cancelled`, async () => {
    const { listener, ticket, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it(`emit a eventCancelledEvent`, async () => {
    const { listener, ticket, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id)
})
it(`act the message`, async () => {
    const { listener, ticket, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})