import { Listener, Subjects } from "@robstipic/middlewares";
import { AuditLog } from "../../models/auditLog.js";

export class AdminActionListener extends Listener {
  async onMessage(data, msg) {
    try {
      await AuditLog.create({
        adminEmail: data.adminEmail,
        action: data.action,
        service: data.service,
        targetId: data.targetId,
        targetEmail: data.targetEmail || null,
        details: data.details || {},
        timestamp: new Date(data.timestamp),
      });

      console.log(
        `[audit] Logged: ${data.action} by ${data.adminEmail} (service: ${data.service})`,
      );
      msg.ack();
    } catch (error) {
      console.error("[audit] Error saving log:", error);
    }
  }
}
