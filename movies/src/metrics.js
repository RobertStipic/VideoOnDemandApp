import client from "@prometheus-io/client";

client.collectDefaultMetrics({ register: client.register });

export const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

export const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export const moviesQueued = new client.Counter({
  name: "movies_queued_total",
  help: "Movies queued for transcode",
});

export const register = client.register;
