# API Gateway Worker

**Worker name**: `api-blackroadio`  
**Live URL**: https://api.blackroad.io  
**Entry point**: `src/index.js`  
**Config**: `wrangler.toml`

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Authentication](#3-authentication)
4. [Stripe Integration](#4-stripe-integration)
5. [Interactive Docs](#5-interactive-docs)
6. [Deployment](#6-deployment)

---

## 1. Overview

The API Gateway worker is the primary developer-facing entry point for the BlackRoad platform. It provides:

- **AI request routing** — forwards prompts to the local Ollama fleet via the BlackRoad Gateway
- **Agent management** — list and interact with named AI agents
- **Memory journaling** — PS-SHA∞ hash-chain memory access
- **Verification** — claim and fact verification
- **World generation stats** — live world data
- **Interactive documentation** — browser-rendered API explorer

---

## 2. API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/v1/agent` | 🔐 Required | Route request to an AI agent |
| `GET` | `/v1/agents` | Public | List available agents |
| `GET` | `/v1/providers` | Public | List AI providers |
| `GET` | `/v1/memory` | Public | Memory journal stats |
| `GET` | `/v1/memory/recent` | Public | Recent journal entries |
| `POST` | `/v1/verify` | Public | Verify an information claim |
| `GET` | `/v1/worlds` | Public | World generation stats |
| `POST` | `/v1/stripe/webhook` | Stripe signature | Stripe webhook receiver |
| `GET` | `/healthz` | Public | Gateway health check |
| `GET` | `/metrics` | Public | Gateway metrics |
| `GET` | `/` | Public | Interactive API documentation (HTML) |
| `OPTIONS` | `*` | — | CORS preflight |

---

## 3. Authentication

Authenticated endpoints (`/v1/agent`) require a `Bearer` token in the `Authorization` header:

```http
POST /v1/agent HTTP/1.1
Host: api.blackroad.io
Authorization: Bearer <BLACKROAD_API_KEY>
Content-Type: application/json

{
  "prompt": "Design a sci-fi world",
  "agent": "octavia"
}
```

---

## 4. Stripe Integration

The API worker handles Stripe subscription events via webhooks.

**Webhook endpoint**: `POST /v1/stripe/webhook`

**Handled events**:

| Event | Action |
|---|---|
| `checkout.session.completed` | Activate subscription |
| `customer.subscription.updated` | Update plan limits |
| `customer.subscription.deleted` | Deactivate subscription |
| `invoice.payment_failed` | Pause service, notify user |

**Required secrets**:

```bash
wrangler secret put STRIPE_SECRET_KEY --name api-blackroadio
wrangler secret put STRIPE_WEBHOOK_SECRET --name api-blackroadio
```

---

## 5. Interactive Docs

Visiting `https://api.blackroad.io` in a browser renders a styled API reference with live "Try it" buttons for every endpoint.

---

## 6. Deployment

```bash
cd workers/api
wrangler deploy
```

Automated via [`.github/workflows/deploy-blog-api.yml`](../../.github/workflows/deploy-blog-api.yml) on push to `workers/api/**`.
