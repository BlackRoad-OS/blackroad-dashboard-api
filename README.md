# BlackRoad Dashboard API

> **BlackRoad OS** — Your AI. Your Hardware. Your Rules.
> The production backend powering the BlackRoad dashboard: 30,000 AI agents, live world generation, and a tokenless edge API running entirely on Cloudflare Workers.

[![Deploy Status](https://img.shields.io/badge/deploy-cloudflare_workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![License](https://img.shields.io/badge/license-Proprietary-red)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./wrangler.toml)
[![API Health](https://img.shields.io/badge/API-dashboard--api.blackroad.io-brightgreen)](https://dashboard-api.blackroad.io/health)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Workers Index](#3-workers-index)
4. [API Endpoint Reference](#4-api-endpoint-reference)
5. [Environment Variables & Secrets](#5-environment-variables--secrets)
6. [Deployment](#6-deployment)
7. [npm Integration](#7-npm-integration)
8. [Stripe Integration](#8-stripe-integration)
9. [End-to-End (E2E) Verification](#9-end-to-end-e2e-verification)
10. [Infrastructure](#10-infrastructure)
11. [License](#11-license)

---

## 1. Overview

The **BlackRoad Dashboard API** is the edge-deployed backend for the BlackRoad OS platform. It is a monorepo of independent [Cloudflare Workers](https://workers.cloudflare.com) — each serving a distinct surface of the BlackRoad product: agent telemetry, AI model listings, world generation feeds, documentation, blog, verification, and the main dashboard snapshot.

| Surface | URL | Description |
|---|---|---|
| Dashboard API | `https://dashboard-api.blackroad.io` | Unified snapshot: worlds + agents + status |
| Agents Status | `https://agents-status.blackroad.io` | Live agent fleet telemetry |
| API Gateway | `https://api.blackroad.io` | Tokenless AI request routing & docs |
| Blog | `https://blog.blackroad.io` | Engineering & product blog (RSS included) |
| Documentation | `https://docs.blackroad.io` | Searchable developer documentation index |
| Models | `https://models.blackroad.io` | AI model registry |
| Studio | `https://studio.blackroad.io` | Creative studio interface |
| Verify | `https://verify.blackroad.io` | Fact, URL, and claim verification |
| Worlds | `https://worlds.blackroad.io` | AI world generation stats & artifacts |
| Worlds Feed | `https://worlds-feed.blackroad.io` | RSS/Atom feed of world artifacts |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    blackroad.io (Cloudflare Zone)           │
├──────────────────┬──────────────────┬───────────────────────┤
│  dashboard-api   │   api / verify   │  worlds / worlds-feed │
│  agents-status   │   docs / blog    │  models / studio      │
│  (this repo)     │   (this repo)    │  (this repo)          │
└──────────┬───────┴──────────────────┴────────────┬──────────┘
           │  Cloudflare Workers (edge, global)     │
           ▼                                        ▼
    GitHub API                              Pi Fleet (LAN)
    (blackroad-agents repo)          aria64: 192.168.4.38 (22,500 cap)
    world + lore + code .md          alice:  192.168.4.49  (7,500 cap)
```

- **Runtime**: Cloudflare Workers (V8 isolates, zero cold-starts)
- **Config**: `wrangler.toml` per worker
- **Routing**: Cloudflare zone `blackroad.io` with per-worker route patterns
- **Cache**: `caches.default` (edge cache, configurable TTL per route)
- **Secrets**: Cloudflare Worker Secrets (`GITHUB_TOKEN`, `STRIPE_SECRET_KEY`, etc.)

---

## 3. Workers Index

See [`workers/README.md`](./workers/README.md) for the full workers index.

| Worker | Directory | Route | Docs |
|---|---|---|---|
| Dashboard API | `src/` | `dashboard-api.blackroad.io/*` | [README](./workers/README.md) |
| Agents Status | `workers/agents-status/` | `agents-status.blackroad.io/*` | [README](./workers/agents-status/README.md) |
| API Gateway | `workers/api/` | `api.blackroad.io/*` | [README](./workers/api/README.md) |
| Blog | `workers/blog/` | `blog.blackroad.io/*` | [README](./workers/blog/README.md) |
| Docs | `workers/docs/` | `docs.blackroad.io/*` | [README](./workers/docs/README.md) |
| Models | `workers/models/` | `models.blackroad.io/*` | [README](./workers/models/README.md) |
| Studio | `workers/studio/` | `studio.blackroad.io/*` | [README](./workers/studio/README.md) |
| Verify | `workers/verify/` | `verify.blackroad.io/*` | [README](./workers/verify/README.md) |
| Worlds | `workers/worlds/` | `worlds.blackroad.io/*` | [README](./workers/worlds/README.md) |
| Worlds Feed | `workers/worlds-feed/` | `worlds-feed.blackroad.io/*` | [README](./workers/worlds-feed/README.md) |

---

## 4. API Endpoint Reference

### Dashboard API — `dashboard-api.blackroad.io`

| Method | Path | Description | Cache TTL |
|---|---|---|---|
| `GET` | `/health` | Health check | 10 s |
| `GET` | `/worlds` | World generation data (GitHub-sourced) | 120 s |
| `GET` | `/agents` | Agent fleet list | 30 s |
| `GET` | `/` | Full dashboard snapshot (worlds + agents + status) | 60 s |

### API Gateway — `api.blackroad.io`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/v1/agent` | 🔐 Required | Route request to AI agent |
| `GET` | `/v1/agents` | Public | List available agents |
| `GET` | `/v1/providers` | Public | List AI providers |
| `GET` | `/v1/memory` | Public | Memory journal stats |
| `GET` | `/v1/memory/recent` | Public | Recent journal entries |
| `POST` | `/v1/verify` | Public | Verify information claim |
| `GET` | `/v1/worlds` | Public | World generation stats |
| `GET` | `/healthz` | Public | Gateway health check |
| `GET` | `/metrics` | Public | Gateway metrics |

### Agents Status — `agents-status.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` or `/status` | Agent list with live status |
| `GET` | `/health` | Service health |

### Models — `models.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` or `/models` | Full model registry |
| `GET` | `/health` | Service health |

### Worlds — `worlds.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | World stats snapshot |
| `GET` | `/stats` | Detailed statistics |
| `GET` | `/health` | Service health |

### Worlds Feed — `worlds-feed.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `GET` | `/feed.rss` or `/rss` | RSS 2.0 feed |
| `GET` | `/feed.atom` or `/atom` | Atom 1.0 feed |
| `GET` | `/health` | Service health |

### Verify — `verify.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `POST` | `/verify` | Verify a URL, fact, or claim |
| `GET` | `/facts` | List known BlackRoad facts |
| `GET` | `/health` | Service health |

### Blog — `blog.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Blog index (HTML) |
| `GET` | `/posts/:id` | Single post |
| `GET` | `/rss` | RSS 2.0 feed |
| `GET` | `/health` | Service health |

### Docs — `docs.blackroad.io`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Documentation index |
| `GET` | `/sections` | All sections and pages |
| `GET` | `/search?q=<term>` | Full-text search |
| `GET` | `/health` | Service health |

---

## 5. Environment Variables & Secrets

All secrets are stored as **Cloudflare Worker Secrets** (never committed to source control).

| Secret | Used By | Description |
|---|---|---|
| `GITHUB_TOKEN` | `dashboard-api`, `worlds`, `worlds-feed` | GitHub API token for reading `blackroad-agents` repo |
| `STRIPE_SECRET_KEY` | `api` | Stripe secret key for subscription management |
| `STRIPE_WEBHOOK_SECRET` | `api` | Stripe webhook signing secret |
| `CLOUDFLARE_API_TOKEN` | CI/CD | Cloudflare API token for `wrangler deploy` |

### Setting secrets via Wrangler

```bash
# Set a secret for a specific worker
wrangler secret put GITHUB_TOKEN --name blackroad-dashboard-api
wrangler secret put STRIPE_SECRET_KEY --name api-blackroadio
wrangler secret put STRIPE_WEBHOOK_SECRET --name api-blackroadio
```

### `wrangler.toml` vars (non-secret)

```toml
[vars]
VERSION = "1.0.0"
ENVIRONMENT = "production"
```

---

## 6. Deployment

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) v3+
- Cloudflare account with `blackroad.io` zone

```bash
npm install -g wrangler
wrangler login
```

### Deploy a single worker

```bash
# Deploy the main Dashboard API
wrangler deploy

# Deploy a sub-worker
cd workers/api && wrangler deploy
cd workers/worlds && wrangler deploy
```

### Deploy all workers

```bash
# From repo root
for dir in workers/*/; do
  echo "Deploying $dir..."
  (cd "$dir" && wrangler deploy)
done
```

### CI/CD

Deployment is automated via GitHub Actions:

| Workflow | File | Trigger |
|---|---|---|
| Blog + API Workers | [`.github/workflows/deploy-blog-api.yml`](.github/workflows/deploy-blog-api.yml) | Push to `workers/blog/**` or `workers/api/**` on `main` |
| Worlds Worker | [`.github/workflows/deploy-worlds.yml`](.github/workflows/deploy-worlds.yml) | Push to `workers/worlds/**` on `main` |

Required GitHub secret: `CLOUDFLARE_API_TOKEN`

---

## 7. npm Integration

The BlackRoad platform exposes a typed JavaScript/TypeScript client for interacting with its API workers. Install via npm:

```bash
npm install @blackroad/api-client
```

### Basic usage

```js
import { BlackRoadClient } from '@blackroad/api-client'

const client = new BlackRoadClient({
  baseUrl: 'https://api.blackroad.io',
  apiKey: process.env.BLACKROAD_API_KEY,
})

// List agents
const { agents } = await client.agents.list()

// Route a request to an AI agent
const result = await client.agent.route({
  prompt: 'Design a new world',
  agent: 'octavia',
})
```

> **Note**: The `@blackroad/api-client` npm package is maintained in a separate repository. Refer to its README for the full API surface.

### Local development

```bash
# Clone and install
git clone https://github.com/BlackRoad-OS/blackroad-dashboard-api.git
cd blackroad-dashboard-api

# Install Wrangler (dev dependency)
npm install

# Run the main Dashboard API locally
wrangler dev

# Run a sub-worker locally
cd workers/api && wrangler dev
```

---

## 8. Stripe Integration

BlackRoad OS uses [Stripe](https://stripe.com) for subscription management, usage-based billing, and metered API access.

### Subscription tiers

| Tier | Monthly Price | Agent Capacity | World Generation | Support |
|---|---|---|---|---|
| **Starter** | $0 | 1 agent | 10 worlds / mo | Community |
| **Builder** | $29 | 5 agents | 100 worlds / mo | Email |
| **Pro** | $99 | 25 agents | Unlimited | Priority |
| **Fleet** | Custom | 30,000 agents | Unlimited | Dedicated |

### Stripe webhook events handled

| Event | Description |
|---|---|
| `checkout.session.completed` | Activate new subscription |
| `customer.subscription.updated` | Update plan limits |
| `customer.subscription.deleted` | Deactivate subscription |
| `invoice.payment_failed` | Notify user, pause service |

### Configuration

```bash
# Set Stripe secrets on the API worker
wrangler secret put STRIPE_SECRET_KEY --name api-blackroadio
wrangler secret put STRIPE_WEBHOOK_SECRET --name api-blackroadio
```

### Stripe CLI (local testing)

```bash
# Forward Stripe webhooks to local worker
stripe listen --forward-to localhost:8787/v1/stripe/webhook
```

---

## 9. End-to-End (E2E) Verification

All production workers expose a `/health` endpoint. Run the following script to verify the full fleet is operational:

```bash
#!/bin/bash
set -euo pipefail

WORKERS=(
  "https://dashboard-api.blackroad.io/health"
  "https://agents-status.blackroad.io/health"
  "https://api.blackroad.io/healthz"
  "https://blog.blackroad.io/health"
  "https://docs.blackroad.io/health"
  "https://models.blackroad.io/health"
  "https://verify.blackroad.io/health"
  "https://worlds.blackroad.io/health"
  "https://worlds-feed.blackroad.io/health"
)

ALL_OK=true
for url in "${WORKERS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$STATUS" = "200" ]; then
    echo "✅  $url"
  else
    echo "❌  $url  [HTTP $STATUS]"
    ALL_OK=false
  fi
done

if $ALL_OK; then
  echo ""
  echo "🟢  All workers operational"
else
  echo ""
  echo "🔴  One or more workers are degraded"
  exit 1
fi
```

### Dashboard snapshot (quick check)

```bash
curl -s https://dashboard-api.blackroad.io/ | jq '{status, worlds_total: .worlds.total, agents_active: .agents.active}'
```

Expected output:

```json
{
  "status": {
    "worlds_ok": true,
    "agents_ok": true,
    "overall": "operational"
  },
  "worlds_total": 125000,
  "agents_active": 3
}
```

---

## 10. Infrastructure

| Component | Provider | Details |
|---|---|---|
| Edge workers | Cloudflare Workers | Global, zero cold-start |
| DNS + CDN | Cloudflare | Zone: `blackroad.io` |
| Source of truth | GitHub | `BlackRoad-OS-Inc/blackroad-agents` |
| Pi fleet node 1 | Raspberry Pi (`aria64`) | `192.168.4.38` — 22,500 agent capacity |
| Pi fleet node 2 | Raspberry Pi (`alice`) | `192.168.4.49` — 7,500 agent capacity |
| Billing | Stripe | Subscription + usage-based metering |
| CI/CD | GitHub Actions | Auto-deploy on push to `main` |

---

## 11. License

Copyright © 2024–2026 **BlackRoad OS, Inc.** All Rights Reserved.  
Founder, CEO & Sole Stockholder: Alexa Louise Amundson.

This software is **proprietary and confidential**. See [`LICENSE`](./LICENSE) for full terms.

---

<p align="center">
  <strong>BlackRoad OS, Inc.</strong> · <a href="https://blackroad.io">blackroad.io</a> · <a href="https://dashboard-api.blackroad.io/health">API Status</a>
</p>
