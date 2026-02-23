const ENDPOINTS = [
  { path: '/v1/agent', method: 'POST', desc: 'Route request to AI agent', auth: true },
  { path: '/v1/agents', method: 'GET', desc: 'List available agents', auth: false },
  { path: '/v1/providers', method: 'GET', desc: 'List AI providers', auth: false },
  { path: '/v1/memory', method: 'GET', desc: 'Get memory journal stats', auth: false },
  { path: '/v1/memory/recent', method: 'GET', desc: 'Recent journal entries', auth: false },
  { path: '/v1/verify', method: 'POST', desc: 'Verify information claim', auth: false },
  { path: '/v1/worlds', method: 'GET', desc: 'World generation stats', auth: false },
  { path: '/healthz', method: 'GET', desc: 'Gateway health check', auth: false },
  { path: '/metrics', method: 'GET', desc: 'Gateway metrics', auth: false },
];

const API_BASE = "https://blackroad-gateway.blackroad.workers.dev";

function buildDocsHTML() {
  const rows = ENDPOINTS.map(e => {
    const methodColor = e.method === 'POST' ? '#FF1D6C' : '#2979FF';
    const authBadge = e.auth
      ? `<span class="auth-badge auth-required">🔐 Auth Required</span>`
      : `<span class="auth-badge auth-open">Public</span>`;
    return `
    <tr>
      <td><span class="method-badge" style="background:${methodColor}">${e.method}</span></td>
      <td><code>${e.path}</code></td>
      <td>${e.desc}</td>
      <td>${authBadge}</td>
      <td><button class="try-btn" onclick="tryEndpoint('${e.method}','${e.path}')">Try</button></td>
    </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BlackRoad API Docs</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      line-height: 1.618;
      min-height: 100vh;
    }
    header {
      background: linear-gradient(135deg, #F5A623 0%, #FF1D6C 38.2%, #9C27B0 61.8%, #2979FF 100%);
      padding: 55px 34px;
      text-align: center;
    }
    header h1 { font-size: 2.8rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    header p { color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 1.1rem; }
    .version-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: #fff;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      margin-top: 8px;
    }
    nav {
      background: #111;
      padding: 13px 34px;
      display: flex;
      gap: 21px;
      align-items: center;
      border-bottom: 1px solid #222;
    }
    nav a { color: #aaa; text-decoration: none; font-size: 0.9rem; }
    nav a:hover { color: #FF1D6C; }
    main { max-width: 1060px; margin: 0 auto; padding: 34px 21px; }
    .section { margin-bottom: 34px; }
    .section h2 {
      font-size: 1.3rem;
      color: #fff;
      margin-bottom: 21px;
      padding-bottom: 8px;
      border-bottom: 1px solid #222;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 13px;
      margin-bottom: 34px;
    }
    .info-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 21px;
    }
    .info-card .label { color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-card .value { color: #fff; font-size: 1.1rem; font-weight: 600; margin-top: 4px; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #111;
      border-radius: 8px;
      overflow: hidden;
    }
    thead tr { background: #1a1a1a; }
    th { padding: 13px 16px; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
    td { padding: 13px 16px; border-top: 1px solid #1a1a1a; font-size: 0.9rem; }
    tr:hover td { background: #161616; }
    .method-badge {
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    code { color: #F5A623; font-family: 'SF Mono', Monaco, monospace; font-size: 0.85rem; }
    .auth-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .auth-required { background: #2a1a1a; color: #FF1D6C; border: 1px solid #3a1a1a; }
    .auth-open { background: #0d1f0d; color: #4CAF50; border: 1px solid #1a3a1a; }
    .try-btn {
      background: transparent;
      border: 1px solid #333;
      color: #888;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .try-btn:hover { border-color: #2979FF; color: #2979FF; }
    #response-panel {
      background: #0d0d0d;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 21px;
      margin-top: 21px;
      display: none;
    }
    #response-panel h3 { color: #888; font-size: 0.85rem; margin-bottom: 8px; }
    #response-body { color: #4CAF50; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; word-break: break-all; }
    footer { text-align: center; padding: 34px; color: #444; font-size: 0.85rem; border-top: 1px solid #1a1a1a; }
    footer a { color: #2979FF; }
  </style>
</head>
<body>
  <header>
    <h1>BlackRoad API</h1>
    <p>Tokenless AI Agent Gateway</p>
    <span class="version-badge">v1.0.0</span>
  </header>
  <nav>
    <a href="/">Overview</a>
    <a href="/docs">Docs</a>
    <a href="/endpoints">Endpoints JSON</a>
    <a href="/health">Health</a>
    <a href="https://blackroad.io">blackroad.io</a>
  </nav>
  <main>
    <div class="info-grid">
      <div class="info-card"><div class="label">Base URL</div><div class="value" style="font-size:0.85rem;color:#F5A623">${API_BASE}</div></div>
      <div class="info-card"><div class="label">Total Endpoints</div><div class="value">${ENDPOINTS.length}</div></div>
      <div class="info-card"><div class="label">Auth Required</div><div class="value">${ENDPOINTS.filter(e=>e.auth).length} endpoints</div></div>
      <div class="info-card"><div class="label">Status</div><div class="value" style="color:#4CAF50">● Operational</div></div>
    </div>

    <div class="section">
      <h2>API Endpoints</h2>
      <table>
        <thead>
          <tr><th>Method</th><th>Path</th><th>Description</th><th>Auth</th><th>Try</th></tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>

    <div id="response-panel">
      <h3 id="response-label">Response</h3>
      <pre id="response-body"></pre>
    </div>

    <div class="section">
      <h2>Authentication</h2>
      <div style="background:#111;border:1px solid #222;border-radius:8px;padding:21px">
        <p style="color:#999;margin-bottom:13px">For authenticated endpoints, include your Bearer token:</p>
        <code>Authorization: Bearer &lt;your-token&gt;</code>
      </div>
    </div>
  </main>
  <footer>© 2026 BlackRoad OS, Inc. · <a href="https://blog.blackroad.io">Blog</a> · <a href="https://blackroad.io">Home</a></footer>
  <script>
    async function tryEndpoint(method, path) {
      const panel = document.getElementById('response-panel');
      const body = document.getElementById('response-body');
      const label = document.getElementById('response-label');
      panel.style.display = 'block';
      label.textContent = method + ' ' + path + ' — Loading...';
      body.textContent = '';
      try {
        const res = await fetch('${API_BASE}' + path, { method });
        const text = await res.text();
        try { body.textContent = JSON.stringify(JSON.parse(text), null, 2); }
        catch { body.textContent = text; }
        label.textContent = method + ' ' + path + ' — ' + res.status + ' ' + res.statusText;
      } catch(e) {
        body.textContent = 'Error: ' + e.message;
        label.textContent = method + ' ' + path + ' — Error';
      }
    }
  </script>
</body>
</html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/health") {
      return Response.json({
        status: "ok",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      });
    }

    if (pathname === "/endpoints") {
      return Response.json(ENDPOINTS);
    }

    if (pathname === "/docs") {
      return new Response(buildDocsHTML(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === "/" || pathname === "") {
      return Response.json({
        name: "BlackRoad API Gateway",
        version: "1.0.0",
        description: "Tokenless AI Agent Gateway for BlackRoad OS",
        base_url: API_BASE,
        docs: "https://api.blackroad.io/docs",
        endpoints: ENDPOINTS,
        links: {
          health: "/health",
          docs: "/docs",
          endpoints: "/endpoints",
          blog: "https://blog.blackroad.io",
          home: "https://blackroad.io",
        },
      });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
