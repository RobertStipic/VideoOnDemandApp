# VideoOnDemandApp

**Video-on-Demand (VoD) platform** built with **Node.js** microservices
and a **Next.js** frontend, deployed with **Docker** and **Kubernetes**.

The system supports user authentication, movie catalog management, subscriptions,
payments, recommendations, watch history, watch later lists, trending analytics,
and an admin panel — all communicating via **NATS** (event-driven) and exposed
through a single ingress.

## Overview

VideoOnDemand is a streaming/video subscription platform with:

- user registration, authentication, and account management
- movie catalog with search, filters, and recommendations (OpenAI embeddings)
- subscription plans and Stripe payment processing
- watch history with **Continue Watching** (resume from last position)
- **Watch Later** list per user
- **Trending** movies (top 10 in the last 7 days)
- **Recently Added** movies
- admin panel: manage movies, users, subscriptions, payments, audit log
- automated video transcoding (FFmpeg → DASH) via Bull queue
- email notifications (activation, password reset, payment receipts)
- Prometheus metrics + Grafana dashboards

## Architecture

Microservices architecture with event-driven communication via NATS JetStream.

### Services

| Service                   | Responsibility                                                             |
| ------------------------- | -------------------------------------------------------------------------- |
| `UserAuth`                | Registration, login, JWT issuance, account deletion, admin user management |
| `movies`                  | Movie catalog, search, filters, streaming (DASH), Prometheus metrics       |
| `movies_admin`            | Admin movie upload and deletion (publishes events)                         |
| `transcode_worker`        | FFmpeg transcoding worker (Bull queue → DASH output)                       |
| `subscription`            | Subscription lifecycle (create, extend, cancel, admin overrides)           |
| `subscription_expiration` | Expiration scheduling and cleanup                                          |
| `payment`                 | Stripe payment processing and receipts                                     |
| `payment_expiration`      | Payment timeout handling                                                   |
| `recommendations`         | Vector search (MongoDB Atlas + OpenAI embeddings)                          |
| `watch_history`           | Watch history, Continue Watching, Watch Later, Trending                    |
| `login_activity`          | User activity log (login/registration)                                     |
| `audit`                   | Admin action audit log                                                     |
| `notification`            | Email sending (SMTP)                                                       |
| `client`                  | Next.js frontend (user + admin UI)                                         |

### Communication

- **Synchronous:** HTTP via ingress `vodapp.dev`
- **Asynchronous:** NATS JetStream `vodapp.<subject>`
- **Shared middleware:** `@robstipic/middlewares` (Git submodule)

## Repository Structure

```text
.
├── client/                  # Next.js frontend
├── UserAuth/                # Auth service
├── movies/                  # Movie catalog service
├── movies_admin/            # Admin movie management
├── transcode_worker/        # FFmpeg worker
├── subscription/            # Subscription service
├── subscription_expiration/
├── payment/                 # Stripe payment service
├── payment_expiration/
├── recommendations/         # Vector search recommendations
├── watch_history/           # History, Continue Watching, Watch Later, Trending
├── login_activity/
├── audit/                   # Admin audit log
├── notification/            # Email service
├── infrastructure/
│   ├── k8s/                 # Kubernetes manifests
│   └── helm/                # Monitoring (Prometheus + Grafana)
├── middlewares/             # Shared middleware (Git submodule)
└── skaffold.yaml
```

## Local DNS

Add to `hosts` file (`C:\Windows\System32\drivers\etc\hosts` on Windows):

```text
127.0.0.1 vodapp.dev
```

## Kubernetes Secrets

Create the required secrets (values omitted — use your own):

```bash
kubectl create secret generic jwt-secret \
  --from-literal=JWT_SECRET_KEY=<value> \
  --from-literal=JWT_REFRESH_SECRET=<value>

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<value>
kubectl create secret generic openai-secret --from-literal=OPEN_AI_API=<value>
kubectl create secret generic mongo-url --from-literal=MONGOURI=<value>
kubectl create secret generic smtp-secret \
  --from-literal=SMTP_HOST=<value> \
  --from-literal=SMTP_PORT=<value> \
  --from-literal=SMTP_USER=<value> \
  --from-literal=SMTP_PASS=<value> \
  --from-literal=SMTP_FROM=<value>
```

## Run

```bash
skaffold dev
```

Access the app at `http://vodapp.dev` (or `https://` if TLS is configured).

## Environment variables

Each service has a `.env.example` file documenting required variables.

For running a service outside Kubernetes (e.g. `node src/index.js`),  
copy to `.env` and fill in values:

```bash
cp watch_history/.env.example watch_history/.env
```

**Client (Next.js)** needs a local env file for the Stripe publishable key:

```bash
# client/.env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

In Kubernetes, backend values come from Secrets referenced in  
`infrastructure/k8s/*-deployment.yaml`. `.env` files are not used in-cluster.  
The client Stripe publishable key should be set via the client deployment / ConfigMap or build-time env.

## Features

### User-facing

- Browse, search, and filter movies
- Subscribe (monthly / 6 months / yearly) via Stripe
- Stream movies (DASH via Shaka Player)
- Continue Watching — resume from last position
- Watch Later — save movies for later
- Trending — top 10 most-watched this week
- Recently Added — newest movies in catalog
- Recommendations based on movie embeddings
- Account management (profile, password, subscriptions, payments, history, activity)
- Email activation and password reset

### Admin

- Upload movies (with OMDb metadata import + video file)
- Manage movies (view, delete)
- Manage users (view, delete, promote)
- Manage subscriptions (create, extend, cancel)
- View payments
- View watch history (per user, per movie)
- View audit log (subscriptions, movies, user deletions)
- Upload history and metrics via Prometheus/Grafana

### Monitoring

Prometheus metrics are exposed by `movies` (`/metrics`) and `transcode_worker` (`/metrics`).  
Grafana dashboards are provisioned via Helm (`infrastructure/helm/monitoring-values.yaml`).
