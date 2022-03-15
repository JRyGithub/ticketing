import express, { Request,response,Response } from "express";
import { Ticket } from "../models/ticket";
const router = express.Router()

router.get(`/api/tickets`, async(req:Request,res:Response) => {
    const tickets = Ticket.find({})
    response.send(tickets)
})

export {router as indexTicketRouter}