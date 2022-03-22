
import { Publisher,Subjects,PaymentCreatedEvent } from "@ryweb.solutions/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}