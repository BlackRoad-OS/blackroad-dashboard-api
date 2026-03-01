# Workers Index

This directory contains all Cloudflare Worker sub-services that make up the BlackRoad OS platform backend.

## Table of Contents

1. [Workers at a Glance](#1-workers-at-a-glance)
2. [Agents Status](#2-agents-status)
3. [API Gateway](#3-api-gateway)
4. [Blog](#4-blog)
5. [Docs](#5-docs)
6. [Models](#6-models)
7. [Studio](#7-studio)
8. [Verify](#8-verify)
9. [Worlds](#9-worlds)
10. [Worlds Feed](#10-worlds-feed)
11. [Deployment](#11-deployment)

---

## 1. Workers at a Glance

| Worker | Directory | Live URL | Route Pattern | Status |
|---|---|---|---|---|
| Agents Status | [`agents-status/`](./agents-status/) | [agents-status.blackroad.io](https://agents-status.blackroad.io) | `agents-status.blackroad.io/*` | ✅ Production |
| API Gateway | [`api/`](./api/) | [api.blackroad.io](https://api.blackroad.io) | `api.blackroad.io/*` | ✅ Production |
| Blog | [`blog/`](./blog/) | [blog.blackroad.io](https://blog.blackroad.io) | `blog.blackroad.io/*` | ✅ Production |
| Docs | [`docs/`](./docs/) | [docs.blackroad.io](https://docs.blackroad.io) | `docs.blackroad.io/*` | ✅ Production |
| Models | [`models/`](./models/) | [models.blackroad.io](https://models.blackroad.io) | `models.blackroad.io/*` | ✅ Production |
| Studio | [`studio/`](./studio/) | [studio.blackroad.io](https://studio.blackroad.io) | `studio.blackroad.io/*` | ✅ Production |
| Verify | [`verify/`](./verify/) | [verify.blackroad.io](https://verify.blackroad.io) | `verify.blackroad.io/*` | ✅ Production |
| Worlds | [`worlds/`](./worlds/) | [worlds.blackroad.io](https://worlds.blackroad.io) | `worlds.blackroad.io/*` | ✅ Production |
| Worlds Feed | [`worlds-feed/`](./worlds-feed/) | [worlds-feed.blackroad.io](https://worlds-feed.blackroad.io) | `worlds-feed.blackroad.io/*` | ✅ Production |

---

## 2. Agents Status

**Directory**: [`agents-status/`](./agents-status/)  
**Worker name**: `agents-status-blackroadio`  
**Live URL**: https://agents-status.blackroad.io  
**Docs**: [agents-status/README.md](./agents-status/README.md)

Provides live telemetry for the BlackRoad AI agent fleet. Returns agent list, role assignments, node assignments, and active/idle counts.

**Key endpoints**: `GET /` · `GET /status` · `GET /health`

---

## 3. API Gateway

**Directory**: [`api/`](./api/)  
**Worker name**: `api-blackroadio`  
**Live URL**: https://api.blackroad.io  
**Docs**: [api/README.md](./api/README.md)

Tokenless AI request routing gateway. Proxies requests to the local Ollama fleet, handles memory journaling, and renders interactive API documentation.

**Key endpoints**: `POST /v1/agent` · `GET /v1/agents` · `GET /v1/providers` · `GET /v1/memory` · `GET /healthz` · `GET /metrics`

---

## 4. Blog

**Directory**: [`blog/`](./blog/)  
**Worker name**: `blog-blackroadio`  
**Live URL**: https://blog.blackroad.io  
**Docs**: [blog/README.md](./blog/README.md)

Engineering and product blog. Serves styled HTML posts and an RSS 2.0 feed.

**Key endpoints**: `GET /` · `GET /posts/:id` · `GET /rss` · `GET /health`

---

## 5. Docs

**Directory**: [`docs/`](./docs/)  
**Worker name**: `docs-blackroadio`  
**Live URL**: https://docs.blackroad.io  
**Docs**: [docs/README.md](./docs/README.md)

Developer documentation index and search. Covers CLI, agents, gateway, and infrastructure sections.

**Key endpoints**: `GET /` · `GET /sections` · `GET /search?q=<term>` · `GET /health`

---

## 6. Models

**Directory**: [`models/`](./models/)  
**Worker name**: `models-blackroadio`  
**Live URL**: https://models.blackroad.io  
**Docs**: [models/README.md](./models/README.md)

AI model registry. Lists all models running on the Pi fleet with provider, quantization, context window, and status information.

**Key endpoints**: `GET /` · `GET /models` · `GET /health`

---

## 7. Studio

**Directory**: [`studio/`](./studio/)  
**Worker name**: `studio-blackroadio`  
**Live URL**: https://studio.blackroad.io  
**Docs**: [studio/README.md](./studio/README.md)

Creative studio interface for world and lore generation. Environment: production.

---

## 8. Verify

**Directory**: [`verify/`](./verify/)  
**Worker name**: `verify-blackroadio`  
**Live URL**: https://verify.blackroad.io  
**Docs**: [verify/README.md](./verify/README.md)

Information verification service. Verifies URLs, factual claims, JSON schemas, and known BlackRoad platform facts.

**Key endpoints**: `POST /verify` · `GET /facts` · `GET /health`

---

## 9. Worlds

**Directory**: [`worlds/`](./worlds/)  
**Worker name**: `worlds-blackroadio`  
**Live URL**: https://worlds.blackroad.io  
**Docs**: [worlds/README.md](./worlds/README.md)

Serves AI world generation statistics and artifact listings sourced from the `BlackRoad-OS-Inc/blackroad-agents` GitHub repository. Tracks 125,000+ world artifacts across multiple Pi nodes.

**Key endpoints**: `GET /` · `GET /stats` · `GET /health`

---

## 10. Worlds Feed

**Directory**: [`worlds-feed/`](./worlds-feed/)  
**Worker name**: `worlds-feed-blackroadio`  
**Live URL**: https://worlds-feed.blackroad.io  
**Docs**: [worlds-feed/README.md](./worlds-feed/README.md)

RSS 2.0 and Atom 1.0 syndication feeds for AI world artifacts. Subscribe to get live updates from the BlackRoad Pi fleet.

**Key endpoints**: `GET /feed.rss` · `GET /rss` · `GET /feed.atom` · `GET /atom` · `GET /health`

---

## 11. Deployment

Each worker is deployed independently using [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

```bash
# Deploy a single worker
cd workers/<name>
wrangler deploy

# Deploy all workers from repo root
for dir in workers/*/; do
  echo "Deploying $dir..."
  (cd "$dir" && wrangler deploy)
done
```

CI/CD workflows are defined in [`.github/workflows/`](../.github/workflows/).

---

*See the [root README](../README.md) for full platform documentation.*
