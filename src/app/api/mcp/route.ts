import { NextRequest, NextResponse } from 'next/server';
import { projectsData, publicationsData, skillsData } from '@/lib/data';
import { achievementsData } from '@/lib/achievements';

const profileData = {
  name: 'Mohammad Shihab Hossain',
  title: 'Computer Science Student & Software Developer',
  location: 'Dhaka, Bangladesh',
  bio: 'Problem Solver, Full Stack Developer, and Tech Enthusiast specializing in AI, Machine Learning, and Web Engineering.',
  contact: {
    github: 'https://github.com/Zul-Qarnain',
    linkedin: 'https://www.linkedin.com/in/zul-qarnain20/',
    website: 'https://shihab.vercel.app',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    switch (method) {
      case 'tools/list':
        return NextResponse.json({
          tools: [
            { name: 'get-profile', description: 'Get professional profile, bio, and social links', inputSchema: { type: 'object', properties: {} } },
            { name: 'get-projects', description: 'Get portfolio projects with tech stack and GitHub links', inputSchema: { type: 'object', properties: {} } },
            { name: 'get-publications', description: 'Get research publications and academic papers', inputSchema: { type: 'object', properties: {} } },
            { name: 'get-achievements', description: 'Get awards, honors, and certifications', inputSchema: { type: 'object', properties: {} } },
            { name: 'get-skills', description: 'Get technical skills categorized by domain', inputSchema: { type: 'object', properties: {} } },
          ],
        });

      case 'tools/call':
        if (params?.name === 'get-profile') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(profileData) }] });
        }
        if (params?.name === 'get-projects') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(projectsData) }] });
        }
        if (params?.name === 'get-publications') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(publicationsData) }] });
        }
        if (params?.name === 'get-achievements') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(achievementsData) }] });
        }
        if (params?.name === 'get-skills') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(skillsData) }] });
        }
        break;
    }

    return NextResponse.json({ error: 'Method not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
