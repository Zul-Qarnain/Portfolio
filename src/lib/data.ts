export interface Skill {
  name: string;
  category: string;
  color: string;
  icon: string;
  iconClasses: string;
  href?: string;
}

export const skillCategoryOrder = [
  'Programming Languages',
  'Data Science & ML Libraries',
  'Core Analytical Skills',
  'Web Frameworks (Frontend & Backend)',
  'Databases',
  'Tools & Platforms',
] as const;

export const skillsData: Skill[] = [
  { name: 'Python', category: 'Programming Languages', icon: 'Code2', color: 'bg-primary', iconClasses: 'text-green-500' },
  { name: 'C#', category: 'Programming Languages', icon: 'Braces', color: 'bg-primary', iconClasses: 'text-violet-600' },
  { name: 'C++', category: 'Programming Languages', icon: 'Settings2', color: 'bg-primary', iconClasses: 'text-blue-700' },
  { name: 'Java', category: 'Programming Languages', icon: 'Coffee', color: 'bg-primary', iconClasses: 'text-red-600' },
  { name: 'JavaScript', category: 'Programming Languages', icon: 'Braces', color: 'bg-primary', iconClasses: 'text-yellow-400' },
  { name: 'SQL', category: 'Programming Languages', icon: 'Database', color: 'bg-primary', iconClasses: 'text-sky-600' },
  { name: 'T-SQL', category: 'Programming Languages', icon: 'DatabaseZap', color: 'bg-primary', iconClasses: 'text-red-400' },

  { name: 'PyTorch', category: 'Data Science & ML Libraries', icon: 'Flame', color: 'bg-primary', iconClasses: 'text-orange-500' },
  { name: 'Scikit-learn', category: 'Data Science & ML Libraries', icon: 'TrendingUp', color: 'bg-primary', iconClasses: 'text-orange-600' },
  { name: 'Pandas', category: 'Data Science & ML Libraries', icon: 'Table', color: 'bg-primary', iconClasses: 'text-purple-600' },
  { name: 'NumPy', category: 'Data Science & ML Libraries', icon: 'Sigma', color: 'bg-primary', iconClasses: 'text-blue-500' },
  { name: 'Matplotlib', category: 'Data Science & ML Libraries', icon: 'PieChart', color: 'bg-primary', iconClasses: 'text-blue-600' },

  { name: 'Statistical Analysis', category: 'Core Analytical Skills', icon: 'Sigma', color: 'bg-primary', iconClasses: 'text-indigo-500' },
  { name: 'Data Visualization', category: 'Core Analytical Skills', icon: 'PieChart', color: 'bg-primary', iconClasses: 'text-fuchsia-500' },

  { name: '.NET', category: 'Web Frameworks (Frontend & Backend)', icon: 'Server', color: 'bg-primary', iconClasses: 'text-violet-600' },
  { name: 'Node.js', category: 'Web Frameworks (Frontend & Backend)', icon: 'BoxSelect', color: 'bg-primary', iconClasses: 'text-green-600' },
  { name: 'Hono.js', category: 'Web Frameworks (Frontend & Backend)', icon: 'Server', color: 'bg-primary', iconClasses: 'text-orange-500' },
  { name: 'React', category: 'Web Frameworks (Frontend & Backend)', icon: 'Atom', color: 'bg-primary', iconClasses: 'text-sky-500' },
  { name: 'Next.js', category: 'Web Frameworks (Frontend & Backend)', icon: 'Triangle', color: 'bg-primary', iconClasses: 'text-foreground' },

  { name: 'SQL Server', category: 'Databases', icon: 'DatabaseZap', color: 'bg-primary', iconClasses: 'text-red-500' },
  { name: 'MySQL', category: 'Databases', icon: 'Database', color: 'bg-primary', iconClasses: 'text-sky-600' },
  { name: 'SQLite', category: 'Databases', icon: 'Database', color: 'bg-primary', iconClasses: 'text-blue-400' },

  { name: 'Git', category: 'Tools & Platforms', icon: 'Settings2', color: 'bg-primary', iconClasses: 'text-orange-600' },
  { name: 'GitHub', category: 'Tools & Platforms', icon: 'Code2', color: 'bg-primary', iconClasses: 'text-foreground' },
  { name: 'VS Code', category: 'Tools & Platforms', icon: 'Code2', color: 'bg-primary', iconClasses: 'text-sky-500' },
  { name: 'Visual Studio', category: 'Tools & Platforms', icon: 'Code2', color: 'bg-primary', iconClasses: 'text-violet-500' },
  {
    name: 'Kaggle',
    category: 'Tools & Platforms',
    icon: 'TrendingUp',
    color: 'bg-primary',
    iconClasses: 'text-sky-400',
    href: 'https://www.kaggle.com/shihabdev20',
  },
  {
    name: 'Hugging Face',
    category: 'Tools & Platforms',
    icon: 'Smile',
    color: 'bg-primary',
    iconClasses: 'text-yellow-400',
    href: 'https://huggingface.co/Zulqarnain',
  },
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
  { name: 'Kaggle', url: 'https://www.kaggle.com/shihabdev20', icon: 'Kaggle', ariaLabel: 'View Kaggle profile for Mohammad Shihab Hossain' },
  { name: 'Hugging Face', url: 'https://huggingface.co/Zulqarnain', icon: 'HuggingFace', ariaLabel: 'View Hugging Face profile for Mohammad Shihab Hossain' },
];

export const contactEmail = 'shihab.dev@proton.me';

export const locationData = {
  city: 'Dhaka',
  country: 'Bangladesh',
  availability: 'Available for remote work',
};

export const statsData = [
  { id: 'projects', value: '15+', label: 'Projects Completed', icon: 'FolderKanban' },
  { id: 'experience', value: '8+', label: 'Years Experience', icon: 'Briefcase' },
  { id: 'technologies', value: '35+', label: 'Technologies', icon: 'Code2' },
  { id: 'achievements', value: '20+', label: 'Achievements', icon: 'Trophy' },
];

export interface FeaturedSkill {
  name: string;
  slug: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Languages' | 'Tools';
}

export const featuredSkills: FeaturedSkill[] = [
  { name: 'HTML', slug: 'html', category: 'Frontend' },
  { name: 'CSS', slug: 'css', category: 'Frontend' },
  { name: 'JavaScript', slug: 'javascript', category: 'Languages' },
  { name: 'TypeScript', slug: 'typescript', category: 'Languages' },
  { name: 'React', slug: 'react', category: 'Frontend' },
  { name: 'Node.js', slug: 'nodejs', category: 'Backend' },
  { name: 'Python', slug: 'python', category: 'Languages' },
  { name: 'SQL', slug: 'sql', category: 'Database' },
];

export const skillFilters = ['All', 'Frontend', 'Backend', 'Database', 'Languages', 'Tools'] as const;

export const otherTechnologies = [
  'Tailwind CSS',
  'Git & GitHub',
  'Firebase',
  'Express',
  'PostgreSQL',
  'Next.js',
  'PyTorch',
  'Pandas',
];

export const learningTechnologies = [
  { name: 'Next.js', color: 'bg-zinc-800' },
  { name: 'MongoDB', color: 'bg-emerald-500' },
  { name: 'Docker', color: 'bg-sky-500' },
  { name: 'GraphQL', color: 'bg-pink-500' },
  { name: 'AWS', color: 'bg-orange-400' },
];

export const heroSocialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/zul-qarnain20/', icon: 'Linkedin', ariaLabel: 'LinkedIn' },
  { name: 'GitHub', url: 'https://github.com/Zul-Qarnain', icon: 'Github', ariaLabel: 'GitHub' },
  { name: 'Kaggle', url: 'https://www.kaggle.com/shihabdev20', icon: 'Kaggle', ariaLabel: 'Kaggle' },
  { name: 'Hugging Face', url: 'https://huggingface.co/Zulqarnain', icon: 'HuggingFace', ariaLabel: 'Hugging Face' },
  { name: 'Email', url: 'mailto:shihab.dev@proton.me', icon: 'Mail', ariaLabel: 'Email' },
  { name: 'Medium', url: 'https://medium.com/@mdshihab.dev', icon: 'BookOpen', ariaLabel: 'Medium' },
];

export const educationData = {
  icon: 'School',
  university: 'American International University - Bangladesh (AIUB)',
  major: 'BSc in Computer Science and Engineering',
};

export const experienceData = {
  icon: 'Briefcase',
  summary: "Skilled in Cybersecurity Engineering, AI/ML Engineering, and Research. Dedicated to leveraging this expertise to develop innovative solutions and contribute to impactful projects.",
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
    title: 'A Large Language Model is Not the Right Path to Bring Artificial General Intelligence',
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
  liveUrl?: string;
  image?: string;
  icon: string;
}

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'AI & Robotics Landing Page',
    description: 'A modern landing page showcasing concepts in Artificial Intelligence and Robotics, built with Next.js and Tailwind CSS.',
    techStack: ['React', 'TailwindCSS'],
    githubLink: 'https://github.com/VirsysX/landingpage',
    liveUrl: 'https://github.com/VirsysX/landingpage',
    image: 'https://opengraph.githubassets.com/1/VirsysX/landingpage',
    icon: 'Bot',
  },
  {
    id: '2',
    title: 'VirsysNFT Marketplace Demo',
    description: 'A demonstration NFT marketplace website, exploring digital asset trading. Built with Next.js and Tailwind CSS.',
    techStack: ['Next.js', 'React'],
    githubLink: 'https://github.com/VirsysX/virsysnft',
    liveUrl: 'https://github.com/VirsysX/virsysnft',
    image: 'https://opengraph.githubassets.com/1/VirsysX/virsysnft',
    icon: 'GalleryHorizontalEnd',
  },
  {
    id: '3',
    title: 'PixelRacer 2D Game',
    description: 'A fast-paced, top-down 2D car dodging game built with Three.js. Avoid traffic, collect coins, and chase high scores!',
    techStack: ['Three.js', 'JavaScript'],
    githubLink: 'https://github.com/Zul-Qarnain/PixelRacer',
    liveUrl: 'https://github.com/Zul-Qarnain/PixelRacer',
    image: 'https://opengraph.githubassets.com/1/Zul-Qarnain/PixelRacer',
    icon: 'Gamepad2',
  },
  {
    id: '4',
    title: 'Sanda-AI Discord Bot',
    description: "An AI-powered Discord bot with a 'savage' personality, designed to reply to users with witty and sharp tones. Built with Python.",
    techStack: ['Python', 'Discord.py'],
    githubLink: 'https://github.com/Zul-Qarnain/Sanda-AI',
    liveUrl: 'https://github.com/Zul-Qarnain/Sanda-AI',
    image: 'https://opengraph.githubassets.com/1/Zul-Qarnain/Sanda-AI',
    icon: 'MessageSquare',
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
