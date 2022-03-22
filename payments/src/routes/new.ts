import express, {Request,Response} from 'express'
import { body } from 'express-validator'
import { requireAuth,validateRequest,NotFoundError,BadRequestError, NotAuthorizedError, OrderStatus } from '@ryweb.solutions/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.post(`/api/payments`,
    requireAuth,
    [
        body('token').not().isEmpty(),
        body('orderId').not().isEmpty()
    ],
    validateRequest,
    async(req: Request,res:Response) => {
        const {token,orderId} = req.body
        const order = await Order.findById(orderId)
        if(!order) throw new NotFoundError()
        if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
        if(order.status === OrderStatus.Cancelled) throw new BadRequestError(`Cannot paid for a cancelled order.`)

        const charge =await stripe.charges.create({
            currency: `usd`,
            amount: Number(order.price) * 100,
            source: token
        })
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })
        await payment.save()
        
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            stripeId: payment.stripeId,
            orderId: payment.orderId,
        })

        res.status(201).send(payment)
})

export {router as CreateChargeRouter}