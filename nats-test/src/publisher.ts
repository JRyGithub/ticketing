import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticketCreatedPublisher'

console.clear()

const stan = nats.connect(`ticketing`,`abc`,{
    url: `http://localhost:4222`
})

stan.on(`connect`, async() => {
    console.log(`Publisher connected to Nats`)

    const publisher = new TicketCreatedPublisher(stan)
    try{
        await publisher.publish({
            id: `13`,
            title: `Hello`,
            price: `213`,
        })
    }catch(err){
        console.log(err)
    }
})

