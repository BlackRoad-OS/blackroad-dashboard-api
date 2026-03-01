# Agents Status Worker

**Worker name**: `agents-status-blackroadio`  
**Live URL**: https://agents-status.blackroad.io  
**Entry point**: `src/index.js`  
**Config**: `wrangler.toml`

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Response Schema](#3-response-schema)
4. [Agents Reference](#4-agents-reference)
5. [Deployment](#5-deployment)

---

## 1. Overview

The Agents Status worker provides live telemetry for the BlackRoad AI agent fleet. It returns a static agent registry with runtime status, node assignments, and fleet capacity data.

All responses are JSON. CORS is open (`*`) for browser-side dashboard consumption.

---

## 2. API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Agent list with status (alias of `/status`) |
| `GET` | `/status` | Agent list with status |
| `GET` | `/health` | Service health check |
| `OPTIONS` | `*` | CORS preflight |

---

## 3. Response Schema

**`GET /status`**

```json
{
  "status": "ok",
  "agents": [ { "id": "...", "name": "...", "type": "...", "node": "...", "status": "active | idle", "tasks": 0 } ],
  "total": 5,
  "active": 5,
  "nodes": { "aria64": 4, "alice": 1 },
  "timestamp": "2026-03-01T00:00:00.000Z"
}
```

---

## 4. Agents Reference

| ID | Name | Type | Node | Default Status |
|---|---|---|---|---|
| `octavia` | Octavia | architect | aria64 | active |
| `lucidia` | Lucidia | dreamer | aria64 | active |
| `alice` | Alice | operator | alice | active |
| `aria` | Aria | interface | aria64 | active |
| `shellfish` | Shellfish | hacker | aria64 | active |

---

## 5. Deployment

```bash
cd workers/agents-status
wrangler deploy
```

Route: `agents-status.blackroad.io/*` (zone: `blackroad.io`)
