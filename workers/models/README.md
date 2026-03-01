# Models Worker

**Worker name**: `models-blackroadio`  
**Live URL**: https://models.blackroad.io  
**Entry point**: `src/index.js`  
**Config**: `wrangler.toml`

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Model Registry](#3-model-registry)
4. [Response Schema](#4-response-schema)
5. [Deployment](#5-deployment)

---

## 1. Overview

The Models worker provides the BlackRoad AI model registry. It lists all language models running on the Pi fleet, including provider, quantization, context window size, and operational status.

---

## 2. API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Full model registry (alias of `/models`) |
| `GET` | `/models` | Full model registry |
| `GET` | `/health` | Service health check |
| `OPTIONS` | `*` | CORS preflight |

---

## 3. Model Registry

| Model ID | Name | Provider | Node | Params | Quant | Context | Status |
|---|---|---|---|---|---|---|---|
| `qwen2.5:7b` | Qwen 2.5 7B | ollama | aria64 | 7B | Q4_K_M | 32,768 | loaded |
| `deepseek-r1:7b` | DeepSeek R1 7B | ollama | aria64 | 7B | Q4_K_M | 32,768 | loaded |
| `llama3.2:3b` | Llama 3.2 3B | ollama | alice | 3B | Q4_K_M | 8,192 | relay |
| `mistral:7b` | Mistral 7B | ollama | aria64 | 7B | Q4_K_M | 8,192 | loaded |

---

## 4. Response Schema

**`GET /models`**

```json
{
  "models": [
    {
      "id": "qwen2.5:7b",
      "name": "Qwen 2.5 7B",
      "provider": "ollama",
      "node": "aria64",
      "status": "loaded",
      "params_b": 7,
      "quantization": "Q4_K_M",
      "context": 32768,
      "tags": ["general", "fast"]
    }
  ],
  "total": 4,
  "loaded": 3,
  "gateway": "http://127.0.0.1:8787",
  "timestamp": "2026-03-01T00:00:00.000Z"
}
```

---

## 5. Deployment

```bash
cd workers/models
wrangler deploy
```

Route: `models.blackroad.io/*` (zone: `blackroad.io`)
