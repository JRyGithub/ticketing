import { natsWrapper } from '../../../natsWrapper'
import { TicketUpdatedEvent } from '@ryweb.solutions/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '../ticketUpdatedListener'

const setup = async () => {
    //Create Listener
    const listener = new TicketUpdatedListener(natsWrapper.client)
    //Create and save ticket
    const ticket = Ticket.build({
        title: `concert`,
        price: `10`,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    //Create fake data event
    const data: TicketUpdatedEvent[`data`] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: `hi`,
        price: `101`,
        userId: `jdnsf`,
    }

    //Create fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }

}
it(`find, updates and saves a ticket`, async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)

})
it(`calls ack`, async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})
it(`does not call ack if skips version number`, async () => {
    const { listener, data, msg, ticket } = await setup()
    data.version = 10

    try {
        await listener.onMessage(data, msg)
    }catch(err){}
    expect(msg.ack).not.toHaveBeenCalled()
})


