import { OrderCancelledEvent, Publisher,Subjects } from "@ryweb.solutions/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}