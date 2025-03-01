import { Subjects } from "../../subjects/subjects.js";
import { Publisher } from "./publisher.js";

export class PaymentComplitedPublisher extends Publisher {
  static subject = Subjects.PaymentComplited;
}
