import { Subjects, Publisher } from "@robstipic/middlewares";

export class SubscriptionCreatedPublisher extends Publisher {
  static subject = Subjects.SubscriptionCreated;
}
