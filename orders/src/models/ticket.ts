import { BadRequestError, OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { Order } from "./order"
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
//An interface that describes the properties
//that are required to create a new Ticket
interface TicketAttrs {
    title: string
    price: string
    id: string
}
//An interface that describes the props
// that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event: {id:string,version:number}): Promise<TicketDoc | null>
}
//An interface that describes the props that 
// a Ticket document has
export interface TicketDoc extends mongoose.Document{
    title: string
    price: string
    version: number
    isReserved(): Promise<boolean>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price:{
        type: String,
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
ticketSchema.set(`versionKey`,`version`)
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
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