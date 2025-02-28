import { Subjects } from "../../subjects/subjects.js";
import { Publisher } from "./publisher.js";

export class SubscriptionUpdatedPublisher extends Publisher {
  static subject = Subjects.SubscriptionCreated;
}
