'use client';

import { useEffect } from 'react';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
  };
  execute: () => Promise<unknown>;
}

declare global {
  interface Navigator {
    modelContext?: {
      provideContext: (tools: MCPTool[]) => void;
    };
  }
}

async function callMcpApi(toolName: string) {
  const res = await fetch('/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'tools/call', params: { name: toolName } }),
  });
  return await res.json();
}

export function WebMCPProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.modelContext) {
      navigator.modelContext.provideContext([
        {
          name: 'get-profile',
          description: 'Get professional profile, bio, and social links for Mohammad Shihab Hossain',
          inputSchema: { type: 'object', properties: {} },
          execute: () => callMcpApi('get-profile'),
        },
        {
          name: 'get-projects',
          description: 'Get portfolio projects with tech stack and GitHub links',
          inputSchema: { type: 'object', properties: {} },
          execute: () => callMcpApi('get-projects'),
        },
        {
          name: 'get-publications',
          description: 'Get research publications and academic papers',
          inputSchema: { type: 'object', properties: {} },
          execute: () => callMcpApi('get-publications'),
        },
        {
          name: 'get-achievements',
          description: 'Get awards, honors, and technical certifications',
          inputSchema: { type: 'object', properties: {} },
          execute: () => callMcpApi('get-achievements'),
        },
        {
          name: 'get-skills',
          description: 'Get technical skills categorized by domain',
          inputSchema: { type: 'object', properties: {} },
          execute: () => callMcpApi('get-skills'),
        },
      ]);
    }
  }, []);

  return null;
}
