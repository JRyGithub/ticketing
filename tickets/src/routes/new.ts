import { requireAuth,validateRequest } from "@ryweb.solutions/common";
import express, { Request,Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
const router = express.Router()

router.post(`/api/tickets`,requireAuth,[
    body(`title`)
    .not()
    .isEmpty()
    .withMessage(`Title is required`),
    body(`price`)
    .isFloat({gt: 0})
    .withMessage(`Price must be greater than zero`)
],validateRequest, async(req:Request,res:Response) => {
    const { title,price } = req.body
    const ticket = Ticket.build({ title,price, userId: req.currentUser!.id })
    await ticket.save()

    res.status(201).send(ticket)
})

export {router as createTicketRouter}