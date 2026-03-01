# Blog Worker

**Worker name**: `blog-blackroadio`  
**Live URL**: https://blog.blackroad.io  
**Entry point**: `src/index.js`  
**Config**: `wrangler.toml`

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoints](#2-api-endpoints)
3. [Post Categories](#3-post-categories)
4. [RSS Feed](#4-rss-feed)
5. [Deployment](#5-deployment)

---

## 1. Overview

The Blog worker serves the BlackRoad engineering and product blog. It renders styled HTML pages and provides an RSS 2.0 feed for subscribers.

---

## 2. API Endpoints

| Method | Path | Content-Type | Description |
|---|---|---|---|
| `GET` | `/` | `text/html` | Blog index with all posts |
| `GET` | `/posts/:id` | `text/html` | Single post by numeric ID |
| `GET` | `/rss` | `application/rss+xml` | RSS 2.0 feed |
| `GET` | `/health` | `application/json` | Service health check |

---

## 3. Post Categories

| Category | Color | Topics |
|---|---|---|
| `engineering` | `#2979FF` | Architecture, infrastructure, scale |
| `ai` | `#9C27B0` | Memory, reasoning, agent design |
| `worlds` | `#F5A623` | World generation, Pi fleet |
| `platform` | `#FF1D6C` | Product, privacy, philosophy |

---

## 4. RSS Feed

Subscribe to the BlackRoad blog RSS feed:

```
https://blog.blackroad.io/rss
```

---

## 5. Deployment

```bash
cd workers/blog
wrangler deploy
```

Automated via [`.github/workflows/deploy-blog-api.yml`](../../.github/workflows/deploy-blog-api.yml) on push to `workers/blog/**`.
