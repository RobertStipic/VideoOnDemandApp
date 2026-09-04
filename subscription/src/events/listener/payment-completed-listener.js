import { Listener, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../constants/general.js";
import { SubscriptionUpdatedPublisher } from "../publisher/subscription-updated-publisher.js";
import { natsWrapperClient } from "../../nats-wrapper.js";

export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    try{
    const newSubscription = await Subscription.findById(data.subscriptionId);

    if (!newSubscription) {
      throw new Error("Subscription not found");
    }
    newSubscription.set({ status: data.status });
    await newSubscription.save();

    const oldSubscription = await Subscription.findOne({
      userId: data.userId,
      status: constants.status.succeeded,
      _id: { $ne: newSubscription._id },
      });

    if (oldSubscription){
    oldSubscription.set({
      status: constants.status.extended,
      replacedBySubId: newSubscription._id
    });
    
    await oldSubscription.save();
   
    await new SubscriptionUpdatedPublisher(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionUpdated
    ).publish({
      subscriptionId: oldSubscription._id, 
      status: constants.status.extended,
      replacedBySubId: newSubscription._id,
    })};


    console.log(
      "Payment complited event received: payment status updated with following keyword:",
      newSubscription.status,
      "for subscriptionId:",
      data.subscriptionId
    );

    msg.ack();
  }catch(error) {
    console.error("Error processing payment completed event", error);
  }
  }
  
}
