'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SkillBar } from '@/components/home/SkillBar';
import { skillsData, profileLinks, educationData, experienceData, resumeUrl } from '@/lib/data';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Skill } from '@/lib/data';
import {
  Flame, Smile, Sigma, Braces, Code2, FileText, Atom, Triangle,
  Layout, Palette, BoxSelect, Server, Database, DatabaseZap,
  GraduationCap, Github,
  Settings2, HelpCircle, Bot, GalleryHorizontalEnd, Gamepad2, MessageSquare,
  Coffee, Activity, PieChart, Table, BarChart3, TrendingUp, FlaskConical, Linkedin, School, Briefcase
} from 'lucide-react'

interface GroupedSkills {
  [category: string]: Skill[];
}

const iconComponents: { [key: string]: React.ElementType } = {
  Flame: Flame, Smile: Smile, Sigma: Sigma, Braces: Braces, Code2: Code2, FileText: FileText, Atom: Atom, Triangle: Triangle, Layout: Layout,
  Palette: Palette, BoxSelect: BoxSelect, Server: Server, Database: Database, DatabaseZap: DatabaseZap, GraduationCap: GraduationCap, Github: Github, 
  Settings2: Settings2, HelpCircle: HelpCircle, Bot: Bot, 
  GalleryHorizontalEnd: GalleryHorizontalEnd, Gamepad2: Gamepad2, MessageSquare: MessageSquare,
  Coffee: Coffee, Activity: Activity, PieChart: PieChart,
  Table, BarChart3, TrendingUp,
  FlaskConical: FlaskConical, Linkedin: Linkedin, School: School, Briefcase: Briefcase,
};

// BlogPost interface matching your database schema
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  meta_description?: string;
  published_at: string;
  reading_time: number;
  views_count: number;
  tags: string[];
}

// Updated skills data with specific percentages and colors
const updatedSkillsData: Skill[] = [  
  // Machine Learning
  { name: 'PyTorch', percentage: 60, category: 'Machine Learning', icon: 'Flame', color: 'bg-teal-400', iconClasses: 'text-orange-500'},
  { name: 'Hugging Face', percentage: 50, category: 'Machine Learning', icon: 'Smile', color: 'bg-green-400', iconClasses: 'text-yellow-400' },

  // Data Science
  { name: 'NumPy', percentage: 70, category: 'Data Science', icon: 'Sigma', color: 'bg-blue-500', iconClasses: 'text-blue-500' },
  { name: 'Matplotlib', percentage: 60, category: 'Data Science', icon: 'BarChart3', color: 'bg-blue-600', iconClasses: 'text-blue-600' },
  { name: 'Pandas', percentage: 70, category: 'Data Science', icon: 'Table', color: 'bg-purple-500', iconClasses: 'text-purple-600' },
  { name: 'Scikit-learn', percentage: 50, category: 'Data Science', icon: 'TrendingUp', color: 'bg-orange-500', iconClasses: 'text-orange-600' },

  // Programming Languages
  { name: 'JavaScript', percentage: 70, category: 'Programming Languages', icon: 'Braces', color: 'bg-blue-500', iconClasses: 'text-yellow-400' },
  { name: 'Python', percentage: 90, category: 'Programming Languages', icon: 'Code2', color: 'bg-indigo-500', iconClasses: 'text-green-500' },
  { name: 'TypeScript', percentage: 50, category: 'Programming Languages', icon: 'FileText', color: 'bg-sky-400', iconClasses: 'text-blue-500' },
  { name: 'Java', percentage: 70, category: 'Programming Languages', icon: 'Coffee', color: 'bg-red-500', iconClasses: 'text-red-600' },
  { name: 'C++', percentage: 90, category: 'Programming Languages', icon: 'Settings2', color: 'bg-blue-700', iconClasses: 'text-blue-700' },

  // Frontend
  { name: 'React', percentage: 60, category: 'Frontend', icon: 'Atom', color: 'bg-purple-500', iconClasses: 'text-sky-500' },
  { name: 'Next.js', percentage: 55, category: 'Frontend', icon: 'Triangle', color: 'bg-emerald-500', iconClasses: 'text-foreground dark:text-white' },
  { name: 'HTML5/CSS3', percentage: 80, category: 'Frontend', icon: 'Layout', color: 'bg-orange-400', iconClasses: 'text-orange-500' },
  { name: 'Tailwind CSS', percentage: 60, category: 'Frontend', icon: 'Palette', color: 'bg-pink-400', iconClasses: 'text-purple-500' },

  // Backend
  { name: 'Node.js', percentage: 70, category: 'Backend', icon: 'BoxSelect', color: 'bg-lime-500', iconClasses: 'text-green-600' },
  { name: 'Express', percentage: 70, category: 'Backend', icon: 'Server', color: 'bg-slate-400', iconClasses: 'text-neutral-400' },
  
  // Database
  { name: 'MongoDB', percentage: 50, category: 'Database', icon: 'Database', color: 'bg-cyan-500', iconClasses: 'text-green-500' },
  { name: 'PostgreSQL', percentage: 70, category: 'Database', icon: 'DatabaseZap', color: 'bg-sky-600', iconClasses: 'text-blue-600' },
];

export default function HomePage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = React.useState(true);
  const supabase = createClientComponentClient();
  
  const EducationIcon = iconComponents[educationData.icon];
  const ExperienceIcon = iconComponents[experienceData.icon];

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, meta_description, published_at, reading_time, views_count, tags')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6); // Show latest 6 posts

        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }

        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [supabase]);

  const groupedSkills = updatedSkillsData.reduce<GroupedSkills>((acc, skill) => {
    const { category } = skill;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Define the desired order of skill categories
  const skillCategoryOrder: string[] = [
    'Machine Learning',
    'Data Science',
    'Programming Languages',
    'Frontend',
    'Backend',
    'Database',
  ];

  const sortedSkillCategories = skillCategoryOrder.filter(category => groupedSkills[category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPostDescription = (post: BlogPost) => {
    if (post.excerpt) return post.excerpt;
    if (post.meta_description) return post.meta_description;
    return 'Read more about this interesting topic...';
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section id="home" className="section-container pt-12 md:pt-20">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-2 space-y-8 order-2 md:order-1">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline leading-tight">
                Hi, I&apos;m <span className="text-primary">Mohammad Shihab Hossain</span>
              </h1>
              <div className="mt-6 text-lg text-muted-foreground max-w-2xl space-y-4">
                <p>
                  I'm an aspiring AI researcher and software developer with a strong foundation in deep learning, quantum computing, full-stack web development, and cybersecurity. Over the past year, I've built various projects using Python and Java, gaining hands-on experience with machine learning, PyTorch, and large language models (LLMs). I also co-authored a research paper exploring the intersection of AI and LLMs.
                </p>
                <p>
                  Currently pursuing a B.Sc. in Computer Science at American International University-Bangladesh (AIUB), I'm focused on advancing intelligent systems that have real-world impact. I'm especially interested in using the synergy between AI and quantum physics—Quantum AI—to address challenges in areas like cancer treatment, renewable energy, and human health.
                </p>
                <p>
                  Fluent in 14 programming languages, I'm driven by a passion for building technologies that contribute to a better, smarter future.
                </p>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-200 bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="flex items-center mb-4">
                <EducationIcon className="mr-3 h-7 w-7 text-primary" />
                <h2 className="text-2xl font-headline font-semibold text-foreground">
                  Education
                </h2>
              </div>
              <p className="text-muted-foreground">
                Currently pursuing a {educationData.major} at <strong className="text-foreground">{educationData.university}</strong>.
              </p>
            </div>

            <div className="animate-fade-in-up animation-delay-400 bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="flex items-center mb-4">
                <ExperienceIcon className="mr-3 h-7 w-7 text-primary" />
                <h2 className="text-2xl font-headline font-semibold text-foreground">
                  Experience
                </h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-line">
                {experienceData.summary}
              </p>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col items-center space-y-6 animate-fade-in-right mt-8 md:mt-0 order-1 md:order-2">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image
                src="/handsome.jpeg"
                alt="Mohammad Shihab Hossain - Profile Picture"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex space-x-4">
              {profileLinks.map((link) => {
                const Icon = iconComponents[link.icon] || HelpCircle;
                return (
                  <Link
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </Link>
                );
              })}
            </div>
            <Button asChild size="lg" className="w-full max-w-xs shadow-md hover:shadow-lg transition-shadow">
              <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                View My Resume
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="skills" className="section-container bg-muted/30 dark:bg-popover py-16 md:py-24 rounded-lg my-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-headline font-bold text-center mb-4 text-foreground">
            Skills
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            A collection of technical skills I&apos;ve acquired over the years.
          </p>
          <div className="space-y-12">
            {sortedSkillCategories.map((category) => (
              <div key={category}>
                <h3 className="text-xl font-semibold font-headline mb-6 text-foreground">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {groupedSkills[category].map((skill) => (
                    <SkillBar
                      key={skill.name}
                      skillName={skill.name}
                      percentage={skill.percentage}
                      barColor={skill.color}
                      iconName={skill.icon}
                      iconClasses={skill.iconClasses}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="posts" className="section-container py-16 md:py-24 my-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-headline font-bold text-center mb-4 text-foreground">
            Latest Posts
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Check out my recent blog posts and articles.
          </p>
          
          {postsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No published posts yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back later for new content!
              </p>
              <Button asChild>
                <Link href="/posts">
                  View All Posts
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-card p-6 rounded-lg shadow-md border border-border space-y-4 hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold font-headline text-foreground group-hover:text-primary transition-colors duration-200">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(post.published_at)}</span>
                        {post.reading_time > 0 && (
                          <span>• {post.reading_time} min read</span>
                        )}
                        {post.views_count > 0 && (
                          <span>• {post.views_count} views</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {getPostDescription(post)}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Link 
                      href={`/posts/${post.slug}`} 
                      className="text-primary hover:underline font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
                    >
                      Read More 
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* View All Posts Button */}
              <div className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                  <Link href="/posts" className="inline-flex items-center gap-2">
                    View All Posts
                    <span className="text-lg">→</span>
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}