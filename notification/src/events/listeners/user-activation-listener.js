import { Listener } from "@robstipic/middlewares";
import { sendEmail } from "../../services/emailService.js";
import { activationTemplate } from "../../services/templates/activation.js";

export class UserActivationListener extends Listener {
  async onMessage(data, msg) {
    try {
      console.log(`Activation requested for ${data.email}`);

      const activationUrl = `${process.env.CLIENT_URL}/users/activate?token=${data.token}`;

      const html = activationTemplate({
        firstName: data.firstName,
        activationUrl,
      });

      await sendEmail({
        to: data.email,
        subject: "Activate your VodApp account",
        html,
      });

      msg.ack();
    } catch (error) {
      console.error("Failed to send activation email:", error);
    }
  }
}
