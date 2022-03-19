import { BadRequestError, OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { Order } from "./order"

//An interface that describes the properties
//that are required to create a new Ticket
interface TicketAttrs {
    title: string
    price: number
}
//An interface that describes the props
// that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc
}
//An interface that describes the props that 
// a Ticket document has
export interface TicketDoc extends mongoose.Document{
    title: string
    price: number
    isReserved(): Promise<boolean>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
},
{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}
ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [OrderStatus.Created,OrderStatus.AwaitingPayment,OrderStatus.Complete]
        }
    })
    return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>(`Ticket`,ticketSchema)

export { Ticket }