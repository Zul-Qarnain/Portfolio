import { NextResponse } from 'next/server'
import { profileLinks, educationData, experienceData, skillsData, projectsData, publicationsData } from '@/lib/data'

export async function GET() {
  const markdown = `# Mohammad Shihab Hossain

**Aspiring AI Developer | Software Developer | Problem Solver**

## About
${experienceData.summary}

## Education
${educationData.university}
${educationData.major}

## Skills
${skillsData.map(s => `- ${s.name}: ${s.percentage}%`).join('\n')}

## Projects
${projectsData.map(p => `### ${p.title}\n${p.description}\n**Tech:** ${p.techStack.join(', ')}\n[GitHub](${p.githubLink})`).join('\n\n')}

## Publications
${publicationsData.map(p => `### ${p.title}\n${p.authors}\n${p.venue}, ${p.date}\n[Link](${p.link})`).join('\n\n')}

## Contact
${profileLinks.map(l => `[${l.name}](${l.url})`).join(' | ')}
`
  
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown',
      'x-markdown-tokens': String(markdown.split(/\s+/).length)
    }
  })
}
