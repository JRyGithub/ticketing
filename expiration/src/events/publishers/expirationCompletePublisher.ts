import { ExpirationCompleteEvent, Publisher, Subjects } from "@ryweb.solutions/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}