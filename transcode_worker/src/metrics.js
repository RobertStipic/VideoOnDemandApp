import client from "@prometheus-io/client";

client.collectDefaultMetrics({ register: client.register });

export const transcodeCounter = new client.Counter({
  name: "transcode_jobs_total",
  help: "Total transcode jobs",
  labelNames: ["status"],
});

export const transcodeDuration = new client.Histogram({
  name: "transcode_duration_seconds",
  help: "Transcode duration",
  buckets: [30, 60, 120, 300, 600, 1200],
});

export const activeTranscodes = new client.Gauge({
  name: "transcode_active_jobs",
  help: "Active transcode jobs",
});

export const register = client.register;
