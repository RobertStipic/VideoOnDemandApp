import { Subjects, Publisher } from "@robstipic/middlewares";

export class PaymentComplitedPublisher extends Publisher {
  static subject = Subjects.PaymentComplited;
}
