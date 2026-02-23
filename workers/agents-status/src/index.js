const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

const AGENTS = [
  { id: 'octavia', name: 'Octavia', type: 'architect', node: 'aria64', status: 'active', tasks: 0 },
  { id: 'lucidia', name: 'Lucidia', type: 'dreamer', node: 'aria64', status: 'active', tasks: 0 },
  { id: 'alice',   name: 'Alice',   type: 'operator', node: 'alice',  status: 'active', tasks: 0 },
  { id: 'aria',    name: 'Aria',    type: 'interface', node: 'aria64', status: 'active', tasks: 0 },
  { id: 'shellfish', name: 'Shellfish', type: 'hacker', node: 'aria64', status: 'active', tasks: 0 }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (url.pathname === '/status' || url.pathname === '/') {
      return Response.json({
        status: 'ok',
        agents: AGENTS,
        total: AGENTS.length,
        active: AGENTS.filter(a => a.status === 'active').length,
        nodes: { aria64: 4, alice: 1 },
        timestamp: new Date().toISOString()
      }, { headers: CORS });
    }

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'agents-status' }, { headers: CORS });
    }

    if (url.pathname.startsWith('/agent/')) {
      const id = url.pathname.split('/')[2];
      const agent = AGENTS.find(a => a.id === id);
      if (!agent) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: CORS });
      return Response.json(agent, { headers: CORS });
    }

    return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: CORS });
  }
};
