'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  ChevronRight,
  Code2,
  GraduationCap,
  FlaskConical,
  Bot,
  GalleryHorizontalEnd,
  Gamepad2,
  MessageSquare,
  Calendar,
  MapPin
} from 'lucide-react';
import { SkillsTree } from '@/components/home/SkillsTree';
import { profileLinks, educationData, experienceData, resumeUrl, projectsData, eventsData, publicationsData } from '@/lib/data';
import { useTypewriter } from '@/hooks/use-typewriter';
import ContactFormLoader from '@/components/contact/ContactFormLoader';

export default function HomePage() {
  const typeWriterText = useTypewriter([
    "an Aspiring AI Developer",
    "a Software Developer",
    "a Problem Solver"
  ]);

  const iconComponents: { [key: string]: React.ElementType } = {
    Github, Linkedin, GraduationCap, FlaskConical, Bot, GalleryHorizontalEnd, Gamepad2, MessageSquare
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden relative">
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
              Hi, I&apos;m <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff79c6] via-[#bd93f9] to-[#8be9fd] animate-gradient-x">Mohammad Shihab Hossain.</span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8be9fd] to-[#50fa7b]">I am <span className="typing-cursor">{typeWriterText}</span></span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              I build accessible, pixel-perfect, performant, and responsible web experiences. Fluent in <span className="text-[#ff79c6] font-semibold">14 programming languages</span>, I&apos;m driven by a passion for building technologies that contribute to a <span className="text-[#8be9fd] font-semibold">better, smarter future</span>.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Button asChild className="rounded-full px-8 py-6 text-base bg-white text-black hover:bg-gray-200">
              <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Download Resume
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {profileLinks.map((link) => {
                const Icon = iconComponents[link.icon] || ExternalLink;
                return (
                  <Button key={link.name} asChild variant="outline" size="icon" className="rounded-full w-12 h-12 border-border bg-card hover:bg-accent">
                    <Link href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel}>
                      <Icon className="w-5 h-5" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center md:justify-end animate-float">
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#bd93f9]/30 to-[#ff79c6]/30 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-[#f8f8f2]/20 shadow-[0_0_30px_rgba(255,255,255,0.3),0_0_80px_rgba(189,147,249,0.4)]">
              <Image
                src="/mypic.jpeg"
                alt="Mohammad Shihab Hossain"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            
            {/* Status Badge */}
            <div className="absolute bottom-0 right-0 md:right-4 translate-y-1/2 bg-[#1e1e2e]/90 backdrop-blur-md border border-[#bd93f9]/30 p-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in-up animation-delay-600 z-10">
              <div className="relative">
                <div className="w-3 h-3 bg-[#50fa7b] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-[#50fa7b] rounded-full animate-ping opacity-75" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Status</span>
                <span className="text-sm font-bold text-white">Open to Work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Experience Section */}
      <section id="about" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold font-headline text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#ff79c6] to-[#bd93f9]">About & Experience</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education Card */}
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-bold mb-2">Education</h3>
            <p className="text-[#cbd5e1] mb-4">{educationData.university}</p>
            <p className="text-[#cbd5e1] leading-relaxed">
              {educationData.major}
            </p>
          </div>

          {/* Experience Card */}
          <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-bold mb-2">Experience</h3>
            <p className="text-[#cbd5e1] mb-4">Researcher & Developer</p>
            <p className="text-[#cbd5e1] leading-relaxed">
              {experienceData.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold font-headline text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#8be9fd] to-[#50fa7b]">My Skills</h2>
        <SkillsTree />
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold font-headline text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#ffb86c] to-[#ff79c6]">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projectsData.map((project) => {
             const Icon = iconComponents[project.icon] || Code2;
             return (
              <div key={project.id} className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:-translate-y-1 flex flex-col">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors flex items-center justify-center">
                  <Icon className="w-16 h-16 text-primary/50 group-hover:text-primary transition-colors duration-300 transform group-hover:scale-110" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-[#cbd5e1] mb-6 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full mt-auto">
                    <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      View Project <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
             );
          })}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold font-headline text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#50fa7b] to-[#ffb86c]">Events & Achievements</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.map((event) => (
            <div key={event.id} className="bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--accent),0.2)] hover:-translate-y-1 flex flex-col">
              <div className="relative h-48 w-full bg-muted">
                {event.images && event.images.length > 0 ? (
                  <Image
                    src={event.images[0]}
                    alt={event.imageHint}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/events">
              View All Events <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold font-headline text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#bd93f9] to-[#8be9fd]">Publications</h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {publicationsData.map((pub) => (
            <div key={pub.id} className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--secondary),0.2)] hover:-translate-x-1">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{pub.title}</h3>
                  <p className="text-muted-foreground mb-2">{pub.authors}</p>
                  <p className="text-sm text-secondary-foreground mb-4">{pub.venue} • {pub.date}</p>
                  <Badge variant="outline">{pub.type}</Badge>
                </div>
                <div className="flex items-start">
                   <Button asChild variant="outline" size="sm">
                    <Link href={pub.link} target="_blank">Read Paper <ExternalLink className="ml-2 w-4 h-4"/></Link>
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/publications">
              View All Publications <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-6 py-20 mb-20">
        <div className="max-w-2xl mx-auto bg-card p-8 md:p-12 rounded-3xl border border-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ff79c6] via-[#bd93f9] to-[#8be9fd]">Let&apos;s Connect</h2>
            <p className="text-muted-foreground">
              Have a project in mind or just want to say hi? Feel free to reach out.
            </p>
          </div>
          
          <ContactFormLoader />
        </div>
      </section>

    </div>
  );
}