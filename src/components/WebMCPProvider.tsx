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

export function WebMCPProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.modelContext) {
      navigator.modelContext.provideContext([
        {
          name: 'get-projects',
          description: 'Get portfolio projects with tech stack and GitHub links',
          inputSchema: {
            type: 'object',
            properties: {}
          },
          execute: async () => {
            const res = await fetch('/api/mcp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ method: 'tools/call', params: { name: 'get-projects' } })
            });
            return await res.json();
          }
        },
        {
          name: 'get-publications',
          description: 'Get research publications and papers',
          inputSchema: {
            type: 'object',
            properties: {}
          },
          execute: async () => {
            const res = await fetch('/api/mcp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ method: 'tools/call', params: { name: 'get-publications' } })
            });
            return await res.json();
          }
        }
      ]);
    }
  }, []);

  return null;
}
