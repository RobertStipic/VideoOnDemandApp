import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetEmail: {
      type: String,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      versionKey: false,
    },
  },
);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ adminEmail: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ service: 1 });
AuditLogSchema.index({ targetEmail: 1 });

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);

export { AuditLog };
