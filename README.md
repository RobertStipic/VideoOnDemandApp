# VideoOnDemandApp

A backend-only **Video-on-Demand (VoD) platform** built with **Node.js**, structured as a **microservices-based system** and deployed with **Docker** and **Kubernetes**.

This repository contains multiple services responsible for user authentication, movie management, subscriptions, payments, recommendations, and supporting background workflows. The architecture is designed for scalability, service isolation, and event-driven communication.

## Overview

`VideoOnDemandApp` is a backend system for a streaming/video subscription platform.  
It provides the server-side building blocks required to support a VoD application, including:

- user registration and authentication
- movie catalog management
- subscription management
- payment processing
- recommendations
- watch history and user activity tracking
- subscription/payment expiration workflows

This repository is focused on backend services and infrastructure. There is no frontend/UI application included.

## Architecture

The project is organized as a collection of independent services, each with its own source code, dependencies, and Docker configuration.

### Main characteristics

- **Microservices architecture**
- **Node.js / JavaScript services**
- **Dockerized services**
- **Kubernetes-based deployment**
- **Skaffold support for local Kubernetes development**
- **Event-driven communication** between services (via `nats-wrapper.js` / `nats-client.js` and event listeners/publishers)

## Repository Structure

```text
.
├── UserAuth/
├── infrastructure/
├── login_activity/
├── middlewares/          # Git submodule (shared middleware)
├── movies/
├── payment/
├── payment_expiration/
├── recommendations/
├── subscription/
├── subscription_expiration/
├── watch_history/
└── skaffold.yaml
```

The `middlewares` directory is a **Git submodule** (see [`.gitmodules`](.gitmodules)). After cloning, initialize it with:

```bash
git submodule update --init --recursive
```

Or clone with submodules in one step:

```bash
git clone --recurse-submodules https://github.com/RobertStipic/VideoOnDemandApp.git
```

## Services

### `UserAuth`

Handles authentication and user-related operations.

Responsibilities include:

- user registration
- login/authentication
- token/session handling
- publishing auth-related events

### `movies`

Manages the movie catalog and content metadata.

Responsibilities include:

- storing and exposing movie data
- searching/browsing movies
- serving movie-related business logic
- publishing/consuming catalog events

### `subscription`

Handles subscription lifecycle management.

Responsibilities include:

- creating subscriptions
- tracking plan status
- updating subscription records
- interacting with payments and expiration flows

### `payment`

Handles payment-related operations.

Responsibilities include:

- processing payments
- integrating with external payment providers (Stripe via [`payment/src/stripeClient.js`](payment/src/stripeClient.js))
- recording payment status
- emitting payment events

### `recommendations`

Provides content recommendations for users. It uses **OpenAI** and **MongoDB Atlas** (vector/collection configuration via environment variables) in addition to JWT validation—see [Environment variables](#environment-variables).

### `watch_history`

Tracks what users have watched and their viewing activity.

### `login_activity`

Stores or processes login-related activity for analytics, auditing, or security-related features.

### `payment_expiration`

Handles expired payments or delayed payment workflows.

### `subscription_expiration`

Handles subscription expiration events and related cleanup or state changes.

### `infrastructure`

Contains Kubernetes deployment manifests for running the full system under [`infrastructure/k8s/`](infrastructure/k8s/).

## Technology Stack

- **Node.js** (ES modules)
- **JavaScript**
- **Express**
- **Docker**
- **Kubernetes**
- **Skaffold**
- **NATS** (inter-service messaging; `nats-wrapper.js` / `nats-client.js`)
- **MongoDB** (per-service `DATABASE_URL` or Atlas URLs where applicable)
- **Stripe** ([`payment/src/stripeClient.js`](payment/src/stripeClient.js); configure with `STRIPE_KEY`)

## Event-Driven Communication

Several services include files such as:

- `nats-wrapper.js`
- `nats-client.js`
- `events/` (listeners and publishers)

This supports an event bus for inter-service communication using **NATS**, which helps with:

- loose coupling between services
- asynchronous workflows
- scalability
- service-to-service integration

## Local Development

### Prerequisites

Before running this project locally, make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/) or a local cluster such as:
  - Docker Desktop Kubernetes
  - Minikube
  - Kind
- [Skaffold](https://skaffold.dev/)

### Clone the repository

```bash
git clone https://github.com/RobertStipic/VideoOnDemandApp.git
cd VideoOnDemandApp
git submodule update --init --recursive
```

### Install dependencies

Dependencies are installed **per service** (each directory with a `package.json`):

```bash
cd UserAuth && npm install && cd ..
cd movies && npm install && cd ..
cd payment && npm install && cd ..
cd subscription && npm install && cd ..
cd recommendations && npm install && cd ..
cd watch_history && npm install && cd ..
cd login_activity && npm install && cd ..
cd payment_expiration && npm install && cd ..
cd subscription_expiration && npm install && cd ..
```

## Running the Project

### Option 1: Docker / Kubernetes via Skaffold

From the repository root:

```bash
skaffold dev
```

This typically builds service images, deploys manifests under `infrastructure/k8s/`, and can sync local source changes depending on your Skaffold profile.

**Skaffold build context casing:** [`skaffold.yaml`](skaffold.yaml) uses `context: userauth` for the auth service while the directory on disk is `UserAuth`. This usually works on case-insensitive filesystems (common default on macOS). On **case-sensitive** systems (typical Linux), Skaffold may fail to resolve the context until the `context` path matches the actual folder name (or the folder is renamed to match).

### Option 2: Run services individually

Each HTTP service exposes `src/index.js` and can be started after `npm install`:

```bash
cd UserAuth
npm install
npm start
```

Repeat for other services as needed. Exact scripts are defined in each service’s `package.json` (many use `nodemon` for `npm start`).

## Environment variables

Configuration is environment-driven. Common variables used at service startup include:

| Area | Variables |
|------|-----------|
| Many services | `NATS_URL`, `DATABASE_URL` (MongoDB) |
| Auth-protected HTTP APIs | `JWT_PRIVATE_KEY` |
| Payment | `STRIPE_KEY` (see Kubernetes secret wiring in [`infrastructure/k8s/payment-deployment.yaml`](infrastructure/k8s/payment-deployment.yaml)) |
| Recommendations | `JWT_PRIVATE_KEY`, `OPENAI_API_KEY`, `MONGOATLAS_URL`, `DATABASE_NAME`, `COLLECTION_NAME` |

For cluster deployments, prefer [`infrastructure/k8s/`](infrastructure/k8s/) as the reference for env names, secrets, and service URLs. Per-service `src/index.js` files validate required variables at boot.

A useful follow-up is adding `.env.example` files per service and expanding this section with ports and optional variables.

## API

This repository exposes **multiple HTTP APIs** (one primary app per service). Typical areas include authentication, movie catalog, subscriptions, payments, recommendations, watch history, and activity endpoints.

Exact routes, request bodies, and responses are defined in each service under `src/routes/`. Consider adding OpenAPI specs or per-service READMEs in a later iteration.

## Deployment

Indicators of container-first deployment:

- `Dockerfile` in service directories
- [`infrastructure/k8s/`](infrastructure/k8s/) manifests
- [`skaffold.yaml`](skaffold.yaml) at the repository root

Suited for local Kubernetes development and cloud-native multi-service orchestration.

## Current status

This repository is a backend-oriented VoD-style platform: microservice boundaries by domain, infrastructure-oriented layout, and learning/production-hardening work left to individual deployment needs.

## Suggested improvements

- per-service README files and API documentation
- architecture diagram
- `.env.example` files per service
- documented database and NATS bootstrap steps
- test and CI/CD documentation
- an explicit `LICENSE` file in the repo root

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add or update documentation
5. Open a pull request

Example:

```bash
git checkout -b feature/improve-readme
```