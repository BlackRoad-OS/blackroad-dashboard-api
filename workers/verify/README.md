# Verify Worker

**Worker name**: `verify-blackroadio`  
**Live URL**: https://verify.blackroad.io  
**Entry point**: `src/index.js`  
**Config**: `wrangler.toml`

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Known Facts Reference](#3-known-facts-reference)
4. [Verification Types](#4-verification-types)
5. [Response Schema](#5-response-schema)
6. [Deployment](#6-deployment)

---

## 1. Overview

The Verify worker is the BlackRoad information verification service. It can verify URLs (via HTTP HEAD), factual claims against the known BlackRoad source-of-truth registry, and JSON schema conformance.

---

## 2. API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/verify` | Verify a URL, fact, or claim |
| `GET` | `/facts` | List all known BlackRoad facts |
| `GET` | `/health` | Service health check |
| `OPTIONS` | `*` | CORS preflight |

---

## 3. Known Facts Reference

| Key | Value |
|---|---|
| `worlds_api` | `https://worlds.blackroad.io` |
| `agents_api` | `https://agents-status.blackroad.io` |
| `models_api` | `https://models.blackroad.io` |
| `dashboard_api` | `https://dashboard-api.blackroad.io` |
| `gateway_port` | `8787` |
| `blackroad_org` | `BlackRoad-OS` |
| `blackroad_inc_org` | `BlackRoad-OS-Inc` |
| `pi_aria64` | `192.168.4.38` |
| `pi_alice` | `192.168.4.49` |

---

## 4. Verification Types

| Type | Description |
|---|---|
| `url` | HTTP HEAD request; returns status code and response time |
| `fact` | Match against known BlackRoad facts registry |
| `schema` | Validate a JSON object against a provided schema |

---

## 5. Response Schema

**`POST /verify`** — request body:

```json
{
  "type": "url",
  "value": "https://worlds.blackroad.io"
}
```

Response:

```json
{
  "verified": true,
  "type": "url",
  "value": "https://worlds.blackroad.io",
  "status": 200,
  "latency_ms": 42
}
```

---

## 6. Deployment

```bash
cd workers/verify
wrangler deploy
```
