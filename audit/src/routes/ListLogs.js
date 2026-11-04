import express from "express";
import { currentUser, adminAuthorization } from "@robstipic/middlewares";
import { AuditLog } from "../models/auditLog.js";

const listLogsRouter = express.Router();

listLogsRouter.get("/audit/logs", adminAuthorization, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.service && req.query.service !== "all") {
      filter.service = req.query.service;
    }

    if (req.query.action && req.query.action !== "all") {
      filter.action = req.query.action;
    }

    if (req.query.search) {
      filter.$or = [
        { adminEmail: { $regex: req.query.search, $options: "i" } },
        { targetEmail: { $regex: req.query.search, $options: "i" } },
        { targetId: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[audit] Error listing logs:", error);
    res.status(500).send("Error listing audit logs");
  }
});

export { listLogsRouter };
