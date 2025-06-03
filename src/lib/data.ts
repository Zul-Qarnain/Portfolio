
import type { Github, Linkedin, GraduationCap, FlaskConical, Briefcase, Settings2, School } from 'lucide-react';

export interface Skill {
  name: string;
  percentage: number;
  category: string;
  color: string; // Tailwind CSS background color class for the progress bar fill
  icon: string; // Lucide icon name
  iconClasses: string; // Tailwind CSS classes for icon color
}

export const skillsData: Skill[] = [
  // Machine Learning
  { name: 'PyTorch', percentage: 60, category: 'Machine Learning', icon: 'Flame', color: 'bg-teal-400', iconClasses: 'text-orange-500' },
  { name: 'Hugging Face', percentage: 50, category: 'Machine Learning', icon: 'Smile', color: 'bg-green-400', iconClasses: 'text-yellow-400' },
  
  // Data Science
  { name: 'NumPy', percentage: 70, category: 'Data Science', icon: 'Sigma', color: 'bg-blue-500', iconClasses: 'text-blue-500' },
  { name: 'Matplotlib', percentage: 60, category: 'Data Science', icon: 'PieChart', color: 'bg-blue-600', iconClasses: 'text-blue-600' },
  { name: 'Pandas', percentage: 70, category: 'Data Science', icon: 'Table', color: 'bg-purple-500', iconClasses: 'text-purple-600' },
  { name: 'Scikit-learn', percentage: 50, category: 'Data Science', icon: 'TrendingUp', color: 'bg-orange-500', iconClasses: 'text-orange-600' },
  
  // Programming Languages
  { name: 'JavaScript', percentage: 70, category: 'Programming Languages', icon: 'Braces', color: 'bg-yellow-400', iconClasses: 'text-yellow-400' },
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


export interface ProfileLink {
  name: string;
  url: string;
  icon: string; 
  ariaLabel: string;
}

export const profileLinks: ProfileLink[] = [
  { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=RebPXvAAAAAJ&hl=en&authuser=3', icon: 'GraduationCap', ariaLabel: 'View Google Scholar profile for Mohammad Shihab Hossain' },
  { name: 'GitHub', url: 'https://github.com/Zul-Qarnain', icon: 'Github', ariaLabel: 'View GitHub profile for Mohammad Shihab Hossain' },
  { name: 'ResearchGate', url: 'https://www.researchgate.net/profile/Mohammad-Hossian-2?ev=hdr_xprf', icon: 'FlaskConical', ariaLabel: 'View ResearchGate profile for Mohammad Shihab Hossain' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/zul-qarnain20/', icon: 'Linkedin', ariaLabel: 'View LinkedIn profile for Mohammad Shihab Hossain' },
];

export const educationData = {
  icon: 'School',
  university: 'American International University - Bangladesh (AIUB)',
  major: 'BSc in Computer Science and Engineering',
};

export const experienceData = {
  icon: 'Briefcase',
  summary: "Skilled in Cybersecurity Engineering, AI/ML Engineering, and Research. Dedicated to leveraging these expertises to develop innovative solutions and contribute to impactful projects.",
};

export const skillsSectionData = {
  icon: 'Settings2', 
};


export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  date: string;
  link: string;
  type: 'Journal' | 'Conference';
}

export const publicationsData: Publication[] = [
  {
    id: '1',
    title: 'A large Language Model is not the Right Path to Bring Artificial General Intelligence',
    authors: 'Md. Mobin Chowdhury, Mohammad Shihab Hossain, Md. Faruk Abdullah Al Sohan',
    venue: '7th IEOM Bangladesh International Conference on Industrial Engineering and Operations Management, AIUB Campus, Dhaka',
    date: 'December 2024',
    link: 'https://www.researchgate.net/publication/389855793_A_large_Language_Model_is_not_the_Right_Path_to_Bring_Artificial_General_Intelligence',
    type: 'Conference',
  },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  icon: string; 
}

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'AI & Robotics Landing Page',
    description: 'A modern landing page showcasing concepts in Artificial Intelligence and Robotics, built with Next.js and Tailwind CSS.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'],
    githubLink: 'https://github.com/VirsysX/landingpage',
    icon: 'Bot' 
  },
  {
    id: '2',
    title: 'VirsysNFT Marketplace Demo',
    description: 'A demonstration NFT marketplace website, exploring digital asset trading. Built with Next.js and Tailwind CSS.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'],
    githubLink: 'https://github.com/VirsysX/virsysnft',
    icon: 'GalleryHorizontalEnd'
  },
  {
    id: '3',
    title: 'PixelRacer 2D Game',
    description: 'A fast-paced, top-down 2D car dodging game built with Three.js. Avoid traffic, collect coins, and chase high scores!',
    techStack: ['Three.js', 'JavaScript', 'HTML5'],
    githubLink: 'https://github.com/Zul-Qarnain/PixelRacer',
    icon: 'Gamepad2'
  },
  {
    id: '4',
    title: 'Sanda-AI Discord Bot',
    description: "An AI-powered Discord bot with a 'savage' personality, designed to reply to users with witty and sharp tones. Built with Python.",
    techStack: ['Python', 'Discord.py'],
    githubLink: 'https://github.com/Zul-Qarnain/Sanda-AI',
    icon: 'MessageSquare'
  },
];

export interface Event {
  id: string;
  title: string;
  images: string[];
  imageHint: string;
  date: string;
  location: string;
  description: string;
  story: string;
}

export const eventsData: Event[] = [
  {
    id: '5',
    title: 'Presentation on Paper',
    images: ['/ieom.jpeg'], 
    imageHint: 'paper presentation', 
    date: 'December 21, 2024',
    location: 'American International University - Bangladesh (AIUB)',
    description: 'Presented a paper on novel optimization techniques for large language models.',
    story: 'Thrilled to present our paper "A Large Language Model is Not the Right Path to Bring Artificial General Intelligence" at the 7th International Conference on Industrial Engineering and Operations Management (IEOM), held in Dhaka, Bangladesh. Our work challenges the prevailing assumptions about LLMs and AGI — offering a fresh perspective for researchers, developers, and strategists shaping the future of AI.',
  },
  {
    id: '6',
    title: 'Winners of Best AI Project',
    images: ['/ndc-prize.jpg', '/ndc-prize-three.jpg'], 
    imageHint: 'AI project', 
    date: 'March 13, 2022',
    location: 'Notre Dame College, Dhaka',
    description: 'Our team won first place for developing an AI solution to improve accessibility for visually impaired individuals.',
    story: 'Proud to secure 1st place in the Best IT Project Competition at the Notre Dame Annual Science Festival 2021, with our groundbreaking AI project "VirsysAI" — an innovative conversational system developed a year before ChatGPT emerged. VirsysAI demonstrated early promise in natural language interaction and generative intelligence, reflecting our forward-thinking approach to AI development.',
  },
  {
    id: '7',
    title: 'Awarded 3rd Place in Web Design Competition',
    images: ['/ndc-no-prize-three.jpg','/ndc-prize.jpg'], 
    imageHint: 'web design', 
    date: 'March 13, 2022',
    location: 'Notre Dame College, Dhaka',
    description: 'Developed a visually appealing and responsive website using Next.js and Tailwind CSS.',
    story: 'Developed a visually appealing and responsive website using Next.js and Tailwind CSS. The design process began in Figma, where we created a clean and modern UI, which was later transformed into a fully functional web application. The project focused on showcasing concepts related to Artificial Intelligence and Robotics, serving as a demo website. The final product was successfully deployed on Vercel, ensuring fast performance and scalability.',
  },
  {
    id: '8',
    title: 'Winners of Best IT Project',
    images: ['/govt-science.jpg','/govt-award.jpg'], 
    imageHint: 'AI competition', 
    date: 'May 15, 2022',
    location: 'Govt. Science College, Tejgaon, Dhaka',
    description: 'Our team won first place once again in the Best IT Project Competition at the 10th National Scientist Mania 2022, with our pioneering AI system "VirsysAI" — a conversational AI developed a year before ChatGPT.',
    story: 'Honored to secure 1st place once again in the Best IT Project Competition at the 10th National Scientist Mania 2022, with our pioneering AI system "VirsysAI" — a conversational AI developed a year before ChatGPT. VirsysAI stood out for its early capabilities in natural language understanding, reinforcing our commitment to innovation in artificial intelligence.',
  }
];

export const contactSectionData = {
  note: "I’ll get back to you as soon as possible.",
};

export const resumeUrl = "/resume.pdf";

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  description: string;
  images: string[];
  imageHint: string;
}

export interface Post {
  title: string;
  description: string;
  slug: string;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts');
  return res.json();
}
