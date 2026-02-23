// Quick docs worker
export default {
  async fetch(request) {
    const url = new URL(request.url)
    const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    
    const docs = {
      sections: [
        { id: 'getting-started', title: 'Getting Started', pages: ['installation', 'quickstart', 'concepts'] },
        { id: 'cli', title: 'BR CLI', pages: ['overview', 'gateway', 'worlds', 'agents', 'verify', 'scan'] },
        { id: 'agents', title: 'Agents', pages: ['overview', 'octavia', 'lucidia', 'alice', 'aria', 'shellfish'] },
        { id: 'gateway', title: 'Gateway', pages: ['architecture', 'providers', 'memory', 'endpoints'] },
        { id: 'infrastructure', title: 'Infrastructure', pages: ['cloudflare', 'railway', 'raspberry-pi', 'github'] },
      ],
      base_url: 'https://docs.blackroad.io'
    }
    
    if (url.pathname === '/health') return new Response(JSON.stringify({ status: 'ok' }), { headers: cors })
    if (url.pathname === '/sections') return new Response(JSON.stringify(docs), { headers: cors })
    if (url.pathname.startsWith('/search')) {
      const q = url.searchParams.get('q') || ''
      const results = docs.sections.flatMap(s => 
        s.pages.filter(p => p.includes(q.toLowerCase())).map(p => ({ section: s.id, page: p, url: `${docs.base_url}/${s.id}/${p}` }))
      )
      return new Response(JSON.stringify({ query: q, results }), { headers: cors })
    }
    
    return new Response(JSON.stringify({ service: 'blackroad-docs', ...docs }), { headers: cors })
  }
}
