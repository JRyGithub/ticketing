import { OrderCreatedListener } from './events/listeners/orderCreatedListener'
import { natsWrapper } from './natsWrapper'

const start = async() =>{
    if(!process.env.NATS_URL) throw new Error(`NATS Url must be defined`)
    if(!process.env.NATS_CLIENT_ID) throw new Error(`NATS client id must be defined`)
    if(!process.env.NATS_CLUSTER_ID) throw new Error(`NATS cluster id must be defined`)
    
    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)
        natsWrapper.client.on(`close`, () => {
            console.log(`NATS connection closed!`)
            process.exit()
        })
        process.on(`SIGNINT`, () => natsWrapper.client.close())
        process.on(`SIGTERM`, () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
    }
    catch(err){
        console.log(err)
    }
}
start()