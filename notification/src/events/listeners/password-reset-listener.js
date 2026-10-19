import { Listener } from "@robstipic/middlewares";
import { sendEmail } from "../../services/emailService.js";
import { passwordResetTemplate } from "../../services/templates/passwordReset.js";

export class PasswordResetListener extends Listener {
  async onMessage(data, msg) {
    try {
      console.log(`Password reset for ${data.email}`);

      const resetUrl = `${process.env.CLIENT_URL}/user/reset-password?token=${data.token}`;

      const html = passwordResetTemplate({
        firstName: data.firstName,
        resetUrl,
      });

      await sendEmail({
        to: data.email,
        subject: "Password Reset Request",
        html,
      });

      console.log(`Reset email sent to ${data.email}`);
      msg.ack();
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  }
}
