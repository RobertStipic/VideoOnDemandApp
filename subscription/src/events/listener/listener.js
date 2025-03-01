import { consumerOpts } from "nats";
import { Subjects } from "../../subjects/subjects.js";

export class Listener {
  constructor(jsClient, subject, queueGroupName) {
    this.jsClient = jsClient;
    this.ackWait = 5000;
    this.subject = subject;
    this.queueGroupName = queueGroupName;
    if (!this.subject) throw new Error("Subject must be defined");
    if (!this.queueGroupName) throw new Error("Queue group must be defined");
    if (!this.onMessage) throw new Error("onMessage handler must be defined");
  }

  subscriptionOptions() {
    return consumerOpts()
      .manualAck()
      .ackWait(this.ackWait)
      .durable(this.queueGroupName)
      .deliverGroup(this.queueGroupName)
      .queue(this.queueGroupName)
      .deliverNew()
      .deliverTo(`_INBOX.${this.queueGroupName}`);
  }

  async listen() {
    console.log(`Listening for ${this.subject} / ${this.queueGroupName}`);
    try {
      const sub = await this.jsClient.subscribe(
        `vodapp.${this.subject}`,
        this.subscriptionOptions()
      );

      for await (const msg of sub) {
        console.log(
          `Received new event for subject: ${this.subject} // queue_group_name: ${this.queueGroupName}`
        );
        this.onMessage(this.parseMessage(msg), msg);
      }
    } catch (err) {
      console.error("Listener error:", err);
    }
  }

  parseMessage(msg) {
    return JSON.parse(msg.data.toString());
  }
}
