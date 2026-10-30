import { User } from "../../models/user.js";

export class UserGetByEmailResponder {
  constructor(natsWrapper) {
    this.natsWrapper = natsWrapper;
  }

  listen() {
    this.subscription = this.natsWrapper.client.subscribe("user.get.by.email", {
      queue: "user-get-queue",
      callback: async (err, msg) => {
        if (err) {
          console.error("Responder error:", err);
          return;
        }

        try {
          const { email } = JSON.parse(msg.string());
          const user = await User.findOne({ email });

          if (!user) {
            msg.respond(JSON.stringify({ error: "User not found" }));
            return;
          }

          msg.respond(
            JSON.stringify({
              userId: user._id.toString(),
              email: user.email,
              isActive: user.isActive,
            }),
          );
        } catch (error) {
          console.error("Responder handler error:", error);
          msg.respond(JSON.stringify({ error: error.message }));
        }
      },
    });

    console.log("Listening for user.get.by.email requests");
  }

  stop() {
    this.subscription?.unsubscribe();
  }
}
