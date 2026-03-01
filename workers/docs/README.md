# Docs Worker

**Worker name**: `docs-blackroadio`  
**Live URL**: https://docs.blackroad.io  
**Entry point**: `src/index.js`  
**Config**: `wrangler.toml`  
**Environment**: `production`

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Documentation Sections](#3-documentation-sections)
4. [Search](#4-search)
5. [Deployment](#5-deployment)

---

## 1. Overview

The Docs worker provides a searchable index of all BlackRoad developer documentation. It serves section metadata and page lists, enabling the frontend documentation site to render content dynamically.

---

## 2. API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Full docs index (sections + base URL) |
| `GET` | `/sections` | All sections and their pages |
| `GET` | `/search?q=<term>` | Full-text search across page slugs |
| `GET` | `/health` | Service health check |
| `OPTIONS` | `*` | CORS preflight |

---

## 3. Documentation Sections

| Section ID | Title | Pages |
|---|---|---|
| `getting-started` | Getting Started | installation, quickstart, concepts |
| `cli` | BR CLI | overview, gateway, worlds, agents, verify, scan |
| `agents` | Agents | overview, octavia, lucidia, alice, aria, shellfish |
| `gateway` | Gateway | architecture, providers, memory, endpoints |
| `infrastructure` | Infrastructure | cloudflare, railway, raspberry-pi, github |

---

## 4. Search

```bash
# Example search
curl "https://docs.blackroad.io/search?q=agents"
```

Returns:

```json
{
  "query": "agents",
  "results": [
    { "section": "getting-started", "page": "agents", "url": "https://docs.blackroad.io/getting-started/agents" },
    { "section": "cli", "page": "agents", "url": "https://docs.blackroad.io/cli/agents" }
  ]
}
```

---

## 5. Deployment

```bash
cd workers/docs
wrangler deploy
```
