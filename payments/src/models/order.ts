
import { OrderStatus } from "@ryweb.solutions/common"
import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
//An interface that describes the properties
//that are required to create a new Order
interface OrderAttrs {
    id: string
    price: string
    version: number
    status: OrderStatus
    userId: string
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
    version: number
    userId: string
    price: string
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
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
orderSchema.set(`versionKey`,`version`)
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>(`Order`,orderSchema)

export { Order }