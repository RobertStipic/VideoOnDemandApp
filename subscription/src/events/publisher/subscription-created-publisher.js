import { Subjects } from "../../subjects/subjects.js";
import { Publisher } from "./publisher.js";

export class SubscriptionCreatedPublisher extends Publisher {
  static subject = Subjects.SubscriptionCreated;
}
