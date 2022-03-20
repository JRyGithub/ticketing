import { TicketCreatedListener } from '../ticketCreatedListener'
import { natsWrapper } from '../../../natsWrapper'
import { TicketCreatedEvent } from '@ryweb.solutions/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async() => {
    //Create Listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    //Create fake data event
    const data: TicketCreatedEvent[`data`] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: `hi`,
        price: `10`,
        userId: new mongoose.Types.ObjectId().toHexString(),
    } 
    //Create fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener,data,msg }

}

it(`Creates and saves a ticket`,async() => {
    const { listener,msg,data } = await setup()

    await listener.onMessage(data,msg)

    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)

})

it(`acks the message`,async() => {
    const { listener,msg,data } = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()

})