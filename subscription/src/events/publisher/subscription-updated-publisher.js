import { Subjects, Publisher } from "@robstipic/middlewares";

export class SubscriptionUpdatedPublisher extends Publisher {
  static subject = Subjects.SubscriptionCreated;
}
