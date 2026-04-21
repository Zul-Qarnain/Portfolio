import { NextRequest, NextResponse } from 'next/server'
import { projectsData, publicationsData } from '@/lib/data'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { method, params } = body
  
  switch (method) {
    case 'tools/list':
      return NextResponse.json({
        tools: [
          { name: 'get-projects', description: 'Get portfolio projects', inputSchema: { type: 'object', properties: {} } },
          { name: 'get-publications', description: 'Get research publications', inputSchema: { type: 'object', properties: {} } }
        ]
      })
    
    case 'tools/call':
      if (params.name === 'get-projects') {
        return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(projectsData) }] })
      }
      if (params.name === 'get-publications') {
        return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(publicationsData) }] })
      }
      break
  }
  
  return NextResponse.json({ error: 'Method not found' }, { status: 404 })
}
