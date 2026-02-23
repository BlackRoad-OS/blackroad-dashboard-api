const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

const MODELS = [
  { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B', provider: 'ollama', node: 'aria64', status: 'loaded', params_b: 7, quantization: 'Q4_K_M', context: 32768, tags: ['general', 'fast'] },
  { id: 'deepseek-r1:7b', name: 'DeepSeek R1 7B', provider: 'ollama', node: 'aria64', status: 'loaded', params_b: 7, quantization: 'Q4_K_M', context: 32768, tags: ['reasoning', 'code'] },
  { id: 'llama3.2:3b', name: 'Llama 3.2 3B', provider: 'ollama', node: 'alice', status: 'relay', params_b: 3, quantization: 'Q4_K_M', context: 8192, tags: ['small', 'fast'] },
  { id: 'mistral:7b', name: 'Mistral 7B', provider: 'ollama', node: 'aria64', status: 'loaded', params_b: 7, quantization: 'Q4_K_M', context: 8192, tags: ['general'] }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'models' }, { headers: CORS });
    }

    if (url.pathname === '/models' || url.pathname === '/') {
      return Response.json({
        models: MODELS,
        total: MODELS.length,
        loaded: MODELS.filter(m => m.status === 'loaded').length,
        gateway: 'http://127.0.0.1:8787',
        timestamp: new Date().toISOString()
      }, { headers: CORS });
    }

    if (url.pathname.startsWith('/models/')) {
      const id = decodeURIComponent(url.pathname.slice(8));
      const model = MODELS.find(m => m.id === id);
      if (!model) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: CORS });
      return Response.json(model, { headers: CORS });
    }

    return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: CORS });
  }
};
