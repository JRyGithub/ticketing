import { NotFoundError,validateRequest,requireAuth,NotAuthorizedError, BadRequestError } from '@ryweb.solutions/common'
import express, {Request,Response } from 'express'
import { body } from 'express-validator'
import { TicketUpdatedPublisher } from '../events/publishers/ticketUpdatedPublisher'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.put(`/api/tickets/:id`,requireAuth,[
    body(`title`)
    .not()
    .isEmpty()
    .withMessage(`Title cannot be empty`),
    body(`price`)
    .isFloat({ gt: 0})
    .withMessage(`Price must be greater than 0`)
],validateRequest,async(req: Request,res:Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket) throw new NotFoundError()

    if(ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    if(ticket.orderId) throw new BadRequestError(`Ticket is reserved`)
    
    ticket.set({ title: req.body.title, price: req.body.price })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    })
    res.send(ticket)
})

export { router as updateTicketRouter }