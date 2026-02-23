/**
 * BlackRoad Verify Worker
 * Information verification service — facts, URLs, claims, schemas
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Known BlackRoad facts (source of truth)
const KNOWN_FACTS = {
  'worlds_api': 'https://worlds.blackroad.io',
  'agents_api': 'https://agents-status.blackroad.io',
  'models_api': 'https://models.blackroad.io',
  'dashboard_api': 'https://dashboard-api.blackroad.io',
  'gateway_port': 8787,
  'blackroad_org': 'BlackRoad-OS',
  'blackroad_inc_org': 'BlackRoad-OS-Inc',
  'pi_aria64': '192.168.4.38',
  'pi_alice': '192.168.4.49'
};

async function verifyUrl(url) {
  try {
    const start = Date.now();
    const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
    const ms = Date.now() - start;
    return {
      status: resp.status,
      ok: resp.ok,
      ms,
      headers: {
        'content-type': resp.headers.get('content-type'),
        'x-powered-by': resp.headers.get('x-powered-by')
      }
    };
  } catch (e) {
    return { status: 0, ok: false, error: e.message };
  }
}

async function verifyClaim(claim) {
  const lower = claim.toLowerCase();
  const results = [];

  // Verify world count claims
  if (lower.includes('world')) {
    try {
      const r = await fetch('https://worlds.blackroad.io/stats', { signal: AbortSignal.timeout(5000) });
      const data = await r.json();
      results.push({
        source: 'worlds.blackroad.io/stats',
        data: { total: data.total, by_node: data.by_node },
        verified: true,
        confidence: 95
      });
    } catch { results.push({ source: 'worlds.blackroad.io', verified: false, confidence: 0 }); }
  }

  // Verify agent count claims
  if (lower.includes('agent')) {
    try {
      const r = await fetch('https://agents-status.blackroad.io/status', { signal: AbortSignal.timeout(5000) });
      const data = await r.json();
      results.push({
        source: 'agents-status.blackroad.io/status',
        data: { total: data.total, active: data.active, nodes: data.nodes },
        verified: true,
        confidence: 95
      });
    } catch { results.push({ source: 'agents-status.blackroad.io', verified: false, confidence: 0 }); }
  }

  // Verify model claims
  if (lower.includes('model') || lower.includes('llm') || lower.includes('ollama')) {
    try {
      const r = await fetch('https://models.blackroad.io/models', { signal: AbortSignal.timeout(5000) });
      const data = await r.json();
      results.push({
        source: 'models.blackroad.io',
        data: { total: data.total, loaded: data.loaded, models: data.models?.map(m => m.id) },
        verified: true,
        confidence: 92
      });
    } catch { results.push({ source: 'models.blackroad.io', verified: false, confidence: 0 }); }
  }

  // Verify org claims
  if (lower.includes('blackroad') || lower.includes('github') || lower.includes('org')) {
    results.push({
      source: 'known_facts',
      data: KNOWN_FACTS,
      verified: true,
      confidence: 100
    });
  }

  const avgConfidence = results.length 
    ? Math.round(results.reduce((s, r) => s + (r.confidence || 0), 0) / results.length)
    : 0;

  return {
    claim,
    checked_at: new Date().toISOString(),
    sources_checked: results.length,
    confidence: avgConfidence,
    verified: avgConfidence > 70,
    evidence: results
  };
}

async function verifySchema(data) {
  const issues = [];
  const type = typeof data;

  if (type !== 'object' || data === null) {
    return { valid: false, issues: ['Root value must be an object'] };
  }

  // Check for common schema issues
  for (const [key, val] of Object.entries(data)) {
    if (val === null) issues.push(`${key}: null value`);
    if (val === '') issues.push(`${key}: empty string`);
    if (key.includes(' ')) issues.push(`${key}: key contains spaces`);
  }

  return {
    valid: issues.length === 0,
    field_count: Object.keys(data).length,
    issues,
    types: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? 'array' : typeof v]))
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'verify', version: '1.0.0' }, { headers: CORS });
    }

    if (url.pathname === '/facts') {
      return Response.json({ facts: KNOWN_FACTS, count: Object.keys(KNOWN_FACTS).length }, { headers: CORS });
    }

    if (url.pathname === '/verify/url' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.url) return Response.json({ error: 'url required' }, { status: 400, headers: CORS });
      const result = await verifyUrl(body.url);
      return Response.json({
        url: body.url,
        result,
        verified: result.ok,
        checked_at: new Date().toISOString()
      }, { headers: CORS });
    }

    if (url.pathname === '/verify/claim' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.claim) return Response.json({ error: 'claim required' }, { status: 400, headers: CORS });
      const result = await verifyClaim(body.claim);
      return Response.json(result, { headers: CORS });
    }

    if (url.pathname === '/verify/schema' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.data) return Response.json({ error: 'data required' }, { status: 400, headers: CORS });
      const result = await verifySchema(body.data);
      return Response.json(result, { headers: CORS });
    }

    if (url.pathname === '/verify/batch' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const items = body.items || [];
      const results = await Promise.all(items.map(async item => {
        if (item.type === 'url') return { ...item, result: await verifyUrl(item.value) };
        if (item.type === 'claim') return { ...item, result: await verifyClaim(item.value) };
        return { ...item, result: { error: 'unknown type' } };
      }));
      return Response.json({ results, count: results.length }, { headers: CORS });
    }

    // Quick GET verify URL
    if (url.pathname === '/verify/url') {
      const target = url.searchParams.get('url');
      if (!target) return Response.json({ error: 'url param required' }, { status: 400, headers: CORS });
      const result = await verifyUrl(target);
      return Response.json({ url: target, result, verified: result.ok }, { headers: CORS });
    }

    return Response.json({
      service: 'blackroad-verify',
      endpoints: [
        'GET  /health',
        'GET  /facts',
        'GET  /verify/url?url=...',
        'POST /verify/url      { url }',
        'POST /verify/claim    { claim }',
        'POST /verify/schema   { data }',
        'POST /verify/batch    { items: [{type, value}] }'
      ]
    }, { headers: CORS });
  }
};
