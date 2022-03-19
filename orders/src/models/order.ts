import { OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { TicketDoc } from './ticket'

//An interface that describes the properties
//that are required to create a new Order
interface OrderAttrs {
    status: OrderStatus
    expiresAt: Date
    userId: string
    ticket: TicketDoc
}
//An interface that describes the props
// that a Order model has
interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc
}
//An interface that describes the props that 
// a Order document has
interface OrderDoc extends mongoose.Document{
    status: OrderStatus
    expiresAt: Date
    userId: string
    ticket: TicketDoc
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    userId:{
        type: String,
        required: true
    },
    expiresAt:{
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Ticket`
    }
},
{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>(`Order`,orderSchema)

export { Order }