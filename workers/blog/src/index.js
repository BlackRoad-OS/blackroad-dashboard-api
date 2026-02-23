const POSTS = [
  { id: 1, title: "Building 30,000 AI Agents: Architecture Decisions", date: "2026-02-20", category: "engineering", tags: ["agents", "architecture", "scale"], excerpt: "How we designed a tokenless gateway to coordinate 30,000 AI agents across Raspberry Pi and cloud infrastructure.", readTime: 8 },
  { id: 2, title: "PS-SHA∞: Hash-Chain Memory for AI Agents", date: "2026-02-18", category: "ai", tags: ["memory", "cryptography", "agents"], excerpt: "A novel approach to persistent AI memory using cryptographic hash chains that ensure tamper-evident audit trails.", readTime: 6 },
  { id: 3, title: "World Generation at Scale: 150+ Worlds and Growing", date: "2026-02-15", category: "worlds", tags: ["worlds", "pi", "generation"], excerpt: "Our Pi fleet generates 2 AI worlds per minute. Here's how we built the infrastructure.", readTime: 5 },
  { id: 4, title: "BlackRoad OS: Your AI, Your Hardware, Your Rules", date: "2026-02-10", category: "platform", tags: ["platform", "privacy", "ai"], excerpt: "Why we built an AI platform where users own their data, their agents, and their compute.", readTime: 10 },
  { id: 5, title: "CECE: A Portable AI Identity System", date: "2026-02-05", category: "ai", tags: ["cece", "identity", "memory"], excerpt: "CECE persists across providers, remembers relationships, and grows over time. Here's the technical design.", readTime: 7 },
];

const CATEGORY_COLORS = {
  engineering: "#2979FF",
  ai: "#9C27B0",
  worlds: "#F5A623",
  platform: "#FF1D6C",
};

function buildRSS() {
  const items = POSTS.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>https://blog.blackroad.io/posts/${p.id}</link>
      <guid>https://blog.blackroad.io/posts/${p.id}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${p.category}</category>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BlackRoad Blog</title>
    <link>https://blog.blackroad.io</link>
    <description>Engineering, AI, and infrastructure insights from BlackRoad OS</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://blog.blackroad.io/feed.rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

function buildHTML() {
  const postCards = POSTS.map(p => {
    const color = CATEGORY_COLORS[p.category] || "#F5A623";
    const tagBadges = p.tags.map(t => `<span class="tag">#${t}</span>`).join(" ");
    return `
    <article class="post-card">
      <div class="post-meta">
        <span class="category-badge" style="background:${color}">${p.category}</span>
        <span class="read-time">${p.readTime} min read</span>
        <span class="date">${p.date}</span>
      </div>
      <h2><a href="/posts/${p.id}">${p.title}</a></h2>
      <p class="excerpt">${p.excerpt}</p>
      <div class="tags">${tagBadges}</div>
    </article>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BlackRoad Blog</title>
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
    header h1 {
      font-size: 2.8rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    header p { color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 1.1rem; }
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
    main { max-width: 860px; margin: 0 auto; padding: 34px 21px; }
    .post-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 21px;
      margin-bottom: 21px;
      transition: border-color 0.2s;
    }
    .post-card:hover { border-color: #FF1D6C; }
    .post-meta {
      display: flex;
      gap: 13px;
      align-items: center;
      margin-bottom: 13px;
      flex-wrap: wrap;
    }
    .category-badge {
      color: #fff;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .read-time, .date { color: #666; font-size: 0.85rem; }
    h2 { font-size: 1.3rem; margin-bottom: 8px; }
    h2 a { color: #fff; text-decoration: none; }
    h2 a:hover { color: #FF1D6C; }
    .excerpt { color: #999; margin-bottom: 13px; font-size: 0.95rem; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .tag { color: #2979FF; font-size: 0.8rem; }
    footer {
      text-align: center;
      padding: 34px;
      color: #444;
      font-size: 0.85rem;
      border-top: 1px solid #1a1a1a;
    }
  </style>
</head>
<body>
  <header>
    <h1>BlackRoad Blog</h1>
    <p>Engineering, AI &amp; infrastructure insights</p>
  </header>
  <nav>
    <a href="/">Home</a>
    <a href="/feed.rss">RSS Feed</a>
    <a href="https://blackroad.io">blackroad.io</a>
  </nav>
  <main>
    ${postCards}
  </main>
  <footer>© 2026 BlackRoad OS, Inc. · <a href="/feed.rss" style="color:#2979FF">RSS</a></footer>
</body>
</html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (pathname === "/health") {
      return Response.json({ status: "ok", posts: POSTS.length });
    }

    if (pathname === "/feed.rss") {
      return new Response(buildRSS(), {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
      });
    }

    const postMatch = pathname.match(/^\/posts\/(\d+)$/);
    if (postMatch) {
      const post = POSTS.find(p => p.id === parseInt(postMatch[1]));
      if (!post) return Response.json({ error: "Post not found" }, { status: 404 });
      return Response.json(post);
    }

    if (pathname === "/" || pathname === "") {
      if (searchParams.get("format") === "html") {
        return new Response(buildHTML(), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
      return Response.json(POSTS);
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
