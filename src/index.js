/**
 * BlackRoad Dashboard API Worker
 * Fetches directly from GitHub + aria64 (bypasses worker-to-worker limitation)
 */

const REPO = "BlackRoad-OS-Inc/blackroad-agents"
const GITHUB_API = "https://api.github.com"
const ARIA64_STATUS = "https://1eb37cf8a4e02ef84.argonaught.workers.dev"

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function parseWorldPath(path) {
  const m = path.match(/^([\w-]+)\/((\d{8})_(\d{6})_(world|lore|code)_(.+))\.md$/)
  if (!m) return null
  const [, dir, filename, date, time, type, slug] = m
  const node = dir === "worlds" ? "aria64" : dir.replace("-worlds", "")
  const ts = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}T${time.slice(0,2)}:${time.slice(2,4)}:${time.slice(4,6)}Z`
  return { id: filename, title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), node, type, path, timestamp: ts }
}

async function fetchWorldsFromGitHub(token) {
  const headers = { Accept: "application/vnd.github.v3+json", "User-Agent": "blackroad-dashboard/1.0" }
  if (token) headers.Authorization = `token ${token}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(`${GITHUB_API}/repos/${REPO}/git/trees/main?recursive=1`, { headers, signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return { error: `GitHub ${res.status}`, worlds: [] }
    const tree = await res.json()
    const worlds = tree.tree
      .map(f => f.path)
      .filter(p => (p.startsWith("worlds/") || p.includes("-worlds/")) && p.endsWith(".md"))
      .map(parseWorldPath)
      .filter(Boolean)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    return { total: worlds.length, worlds }
  } catch (e) {
    clearTimeout(timeout)
    return { error: String(e), worlds: [] }
  }
}

async function fetchAgents(env) {
  // Static agent definitions - always available even without Pi connectivity
  return {
    agents: [
      { id: 'octavia', name: 'Octavia', role: 'Architect', type: 'systems', status: 'active', node: 'aria64', color: '#9C27B0' },
      { id: 'alice', name: 'Alice', role: 'Operator', type: 'devops', status: 'active', node: 'alice', color: '#2979FF' },
      { id: 'lucidia', name: 'Lucidia', role: 'Dreamer', type: 'creative', status: 'active', node: 'aria64', color: '#00BCD4' },
      { id: 'aria', name: 'Aria', role: 'Interface', type: 'frontend', status: 'idle', node: 'local', color: '#F5A623' },
      { id: 'shellfish', name: 'Shellfish', role: 'Hacker', type: 'security', status: 'idle', node: 'local', color: '#FF1D6C' },
    ],
    fleet: { total_capacity: 30000, online_nodes: 2, aria64: { capacity: 22500, ip: '192.168.4.38' }, alice: { capacity: 7500, ip: '192.168.4.49' } }
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })

    const cache = caches.default
    const cacheKey = new Request(request.url)
    const cached = await cache.match(cacheKey)
    if (cached) return cached

    let body, ttl = 60

    if (path === '/health') {
      body = { ok: true, ts: new Date().toISOString() }
      ttl = 10

    } else if (path === '/worlds') {
      body = await fetchWorldsFromGitHub(env.GITHUB_TOKEN)
      ttl = 120

    } else if (path === '/agents') {
      body = await fetchAgents(env)
      ttl = 30

    } else {
      const [worldsData, agentsData] = await Promise.all([
        fetchWorldsFromGitHub(env.GITHUB_TOKEN),
        fetchAgents(env),
      ])

      const worlds = worldsData.worlds || []
      const agents = agentsData.agents || []

      const byNode = {}, byType = {}
      for (const w of worlds) {
        byNode[w.node] = (byNode[w.node] || 0) + 1
        byType[w.type] = (byType[w.type] || 0) + 1
      }

      body = {
        snapshot_at: new Date().toISOString(),
        worlds: {
          total: worldsData.total || worlds.length,
          by_node: byNode,
          by_type: byType,
          latest: worlds[0] || null,
          recent: worlds.slice(0, 5),
          error: worldsData.error || null,
        },
        agents: {
          count: agents.length,
          active: agents.filter(a => a.status === 'active').length,
          fleet: agentsData.fleet || {},
          list: agents,
        },
        status: {
          worlds_ok: !worldsData.error,
          agents_ok: true,
          overall: !worldsData.error ? 'operational' : 'partial',
        },
      }
      ttl = 60
    }

    const response = new Response(JSON.stringify(body, null, 2), {
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}` },
    })

    ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  }
}
