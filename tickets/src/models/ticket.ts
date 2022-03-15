import mongoose from "mongoose"

//An interface that describes the properties
//that are required to create a new Ticket
interface TicketAttrs {
    title: string
    price: string
    userId: string
}
//An interface that describes the props
// that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc
}
//An interface that describes the props that 
// a Ticket document has
interface TicketDoc extends mongoose.Document{
    title: string
    price: string
    userId: string
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>(`Ticket`,ticketSchema)

export { Ticket }