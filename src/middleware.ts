import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  if (request.nextUrl.pathname === '/') {
    response.headers.append('Link', '</.well-known/api-catalog>; rel="api-catalog"')
    response.headers.append('Link', '</.well-known/agent-skills/index.json>; rel="agent-skills"')
    response.headers.append('Link', '</.well-known/mcp/server-card.json>; rel="mcp-server-card"')
  }
  
  const acceptHeader = request.headers.get('accept') || ''
  if (acceptHeader.includes('text/markdown')) {
    const url = new URL('/api/markdown', request.url)
    url.searchParams.set('path', request.nextUrl.pathname)
    return NextResponse.rewrite(url)
  }
  
  return response
}

export const config = {
  matcher: ['/', '/projects', '/publications', '/posts', '/events', '/contact']
}
