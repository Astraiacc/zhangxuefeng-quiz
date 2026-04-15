// Cloudflare Worker: 搜索代理
// 解决前端 CORS 问题，转发搜索请求到 DuckDuckGo

export default {
  async fetch(request) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    if (!query) return new Response(JSON.stringify({ error: 'missing q param' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

    try {
      // DuckDuckGo Instant Answer API
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const resp = await fetch(ddgUrl, { signal: AbortSignal.timeout(8000) });
      const data = await resp.json();

      let results = [];
      if (data.AbstractText) results.push({ title: data.Heading || '', text: data.AbstractText, source: data.AbstractURL || '' });
      if (data.RelatedTopics) {
        for (const t of data.RelatedTopics.slice(0, 5)) {
          if (t.Text) results.push({ title: '', text: t.Text, source: t.FirstURL || '' });
        }
      }

      return new Response(JSON.stringify({ query, results, answer: data.Answer || '' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message, results: [] }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
