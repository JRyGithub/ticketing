
import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
//An interface that describes the properties
//that are required to create a new Payment
interface PaymentAttrs {
    stripeId: string
    orderId: string
}
//An interface that describes the props
// that a Payment model has
interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attrs: PaymentAttrs): PaymentDoc
}
//An interface that describes the props that 
// a Payment document has
interface PaymentDoc extends mongoose.Document{
    stripeId: string,
    orderId: string,
}

const orderSchema = new mongoose.Schema({
    stripeId: {
        type: String,
        required: true,
    },
    orderId:{
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
orderSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>(`Payment`,orderSchema)

export { Payment }