import type { Metadata } from 'next';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata({
  title: 'API Documentation',
  description:
    'Public API and machine-readable endpoints for Mohammad Shihab Hossain’s portfolio: MCP server, Markdown, RSS, sitemap and discovery files.',
  path: '/docs/api',
});

const endpoints = [
  {
    method: 'POST',
    path: '/api/mcp',
    body: 'Read-only JSON-RPC. Send {"method": "tools/call", "params": {"name": "<tool>"}} with a tool of get-profile, get-projects, get-publications, get-achievements or get-skills.',
  },
  {
    method: 'GET',
    path: '/api/markdown?path=<page>',
    body: 'Any indexable page rendered as Markdown (also served automatically when the request carries Accept: text/markdown).',
  },
  {
    method: 'GET',
    path: '/feed.xml',
    body: 'RSS 2.0 feed of all published articles, updated hourly.',
  },
  {
    method: 'GET',
    path: '/sitemap.xml',
    body: 'Canonical list of indexable pages plus published posts.',
  },
];

const discovery = [
  { path: '/.well-known/ai-catalog.json', label: 'Agentic Resource Discovery manifest' },
  { path: '/.well-known/api-catalog', label: 'RFC 9727 API catalog linkset' },
  { path: '/.well-known/openapi.json', label: 'OpenAPI description' },
  { path: '/.well-known/agent-skills/index.json', label: 'Agent skills index' },
  { path: '/.well-known/mcp/server-card.json', label: 'MCP server card' },
  { path: '/auth.md', label: 'Agent authentication notes (public: no auth needed)' },
  { path: '/llms.txt', label: 'Site summary for language models' },
];

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 font-body md:py-14">
      <header className="mb-8 border-b border-white/10 pb-8">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          For developers & agents
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
          API Documentation
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Everything here is public and needs no key. Start from{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
            /.well-known/ai-catalog.json
          </code>{' '}
          for the full capability list.
        </p>
      </header>

      <section aria-labelledby="endpoints-heading" className="mb-10">
        <h2 id="endpoints-heading" className="mb-4 text-xl font-bold text-foreground">
          Endpoints
        </h2>
        <ul className="space-y-3">
          {endpoints.map((item) => (
            <li
              key={item.path}
              className="rounded-2xl border border-white/10 bg-card/50 p-4 backdrop-blur-md"
            >
              <p className="font-mono text-sm font-bold text-foreground">
                <span className="mr-2 inline-block rounded bg-primary/15 px-2 py-0.5 text-xs text-primary">
                  {item.method}
                </span>
                {item.path}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="discovery-heading">
        <h2 id="discovery-heading" className="mb-4 text-xl font-bold text-foreground">
          Discovery files
        </h2>
        <ul className="space-y-2">
          {discovery.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-card/50 px-4 py-3 backdrop-blur-md transition-colors hover:border-primary/40"
              >
                <code className="font-mono text-sm text-foreground">{item.path}</code>
                <span className="text-right text-xs text-muted-foreground">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
