import { cleanExternalUrl } from '@/lib/urls';

export type AchievementCategory = 'academic' | 'certification' | 'competition' | 'conference';
export type AchievementFilterId = 'all' | AchievementCategory | 'event';

export function extractYear(value?: string): string | null {
  if (!value) return null;
  const years = [...value.matchAll(/\b(20\d{2}|19\d{2})\b/g)].map((match) => match[1]);
  if (years.length === 0) return null;
  return years[years.length - 1];
}

export function achievementYear(item: { issued?: string; title: string }): string | null {
  return extractYear(item.issued) || extractYear(item.title);
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  issued?: string;
  expires?: string;
  credentialId?: string;
  url: string;
  category: AchievementCategory;
  featured?: boolean;
  icon: 'award' | 'certificate' | 'trophy' | 'presentation' | 'academic';
}

export const achievementsData: Achievement[] = [
  {
    id: 'dean-fall-2024-2025',
    title: 'Dean’s Award for Academic Excellence — Fall 2024–2025',
    organization: 'American International University-Bangladesh (AIUB)',
    url: cleanExternalUrl(
      'http://aiub.edu/Files/Uploads/updated-deans-list_fall-23-24-to-fall-24-25-and-certificate-collection-schedule.pdf'
    ),
    issued: 'Fall 2024',
    category: 'academic',
    featured: true,
    icon: 'academic',
  },
  {
    id: 'dean-spring-2024-2025',
    title: 'Dean’s Award for Academic Excellence — Spring 2024–2025',
    organization: 'American International University-Bangladesh (AIUB)',
    url: cleanExternalUrl(
      'https://www.aiub.edu/Files/Uploads/deans-list_award_fst_spring-24-25-to-fall-25-26.pdf'
    ),
    issued: 'Spring 2025',
    category: 'academic',
    featured: true,
    icon: 'academic',
  },
  {
    id: 'opswat-icip',
    title: 'OPSWAT Introduction to Critical Infrastructure Protection (ICIP)',
    organization: 'OPSWAT Academy',
    issued: 'Sep 2022',
    expires: 'Sep 2033',
    url: cleanExternalUrl('https://www.credly.com/badges/f67a0f0b-4173-4937-a788-dffb8ee5aa39/public_url'),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'datacamp-git',
    title: 'Introduction to Git',
    organization: 'DataCamp',
    issued: 'Apr 2025',
    url: cleanExternalUrl(
      'https://www.datacamp.com/statement-of-accomplishment/course/6c04a4537355d894602c19b0ca43ffda91c58c35'
    ),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'hackerrank-python',
    title: 'Certified Python Developer',
    organization: 'HackerRank',
    issued: 'Oct 2020',
    credentialId: '7dba995a2dd3',
    url: cleanExternalUrl('https://www.hackerrank.com/certificates/7dba995a2dd3'),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'hackerrank-javascript',
    title: 'Certified JavaScript Developer',
    organization: 'HackerRank',
    issued: 'Sep 2022',
    credentialId: 'c2e21fd2b1d0',
    url: cleanExternalUrl('https://www.hackerrank.com/certificates/c2e21fd2b1d0'),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'tryhackme-aoc-2020',
    title: 'Advent of Cyber 2020 Certificate',
    organization: 'TryHackMe',
    issued: 'May 2021',
    credentialId: 'THM-GE3ASTGYMF',
    url: cleanExternalUrl('https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-GE3ASTGYMF.pdf'),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'ibm-blockchain-foundation',
    title: 'IBM Blockchain Foundation Developer V2',
    organization: 'IBM',
    issued: 'Apr 2021',
    url: cleanExternalUrl('https://www.credly.com/earner/earned/badge/739f527f-406d-4eec-b3eb-9936e9251af5'),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'ibm-blockchain-essentials',
    title: 'IBM Blockchain Essentials V2',
    organization: 'IBM',
    issued: 'Apr 2021',
    url: cleanExternalUrl('https://www.credly.com/badges/1bd5e79c-116f-4307-b06b-45a7f6906236'),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'cisco-cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    organization: 'Cisco',
    issued: 'Nov 2020',
    url: cleanExternalUrl(
      'https://www.youracclaim.com/badges/898a102a-362c-4e94-8699-9cb04cdbc491?source=linked_in_profile'
    ),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'cisco-intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    organization: 'Cisco',
    issued: 'Nov 2020',
    url: cleanExternalUrl(
      'https://www.youracclaim.com/badges/18b2717f-3141-4f4a-a851-b26eb4824847?source=linked_in_profile'
    ),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'aoe-unix-linux',
    title: 'Unix/Linux and Shell Scripting - Crash Course',
    organization: 'Asean Online Education (AOE)',
    issued: 'Sep 2020',
    url: cleanExternalUrl(
      'https://alison.com/certification/check/%2A2y%2410%24StBaTtfg024Y3UhbzkBOWQe5BhhAlPNOMVmu1z33veowQlULZi.'
    ),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'cybrary-intro-it',
    title: 'Introduction to IT & Cybersecurity',
    organization: 'Cybrary',
    issued: 'Jul 2020',
    url: cleanExternalUrl(
      'https://app.cybrary.it/courses/api/certificate/CC-c25d7c0b-36a8-4414-9d20-4f8edac49cb6/view'
    ),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'aoe-ceh',
    title: 'Certified Ethical Hacker (CEH)',
    organization: 'Asean Online Education (AOE)',
    url: cleanExternalUrl(
      'https://alison.com/certification/check/%2A2y%2410%24SGqDMHzcEcDk7JNNRscQs.3n3yOIssaG57vYPeN2d7WOacgag1Vne'
    ),
    category: 'certification',
    icon: 'certificate',
  },
  {
    id: 'govt-science-first-display',
    title: 'Certificate of Appreciation for being First at Project Display',
    organization: 'GOVT. SCIENCE COLLEGE SCIENCE CLUB',
    issued: 'Jan 2022',
    url: cleanExternalUrl(
      'https://drive.google.com/file/d/1UcBDSaWK5mxYXFhDwy1mw1vwwvX2Qs_k/view?usp=sharing'
    ),
    category: 'competition',
    icon: 'trophy',
  },
  {
    id: 'bnmpc-participation',
    title: 'Certificate of Participation',
    organization: 'BNMPC SCIENCE CLUB',
    issued: 'Jan 2022',
    url: cleanExternalUrl(
      'https://drive.google.com/file/d/10qWmbRXi8_sCKMJsN-VEWkelB98TQ-1F/view?usp=sharing'
    ),
    category: 'competition',
    icon: 'award',
  },
  {
    id: 'govt-science-participation',
    title: 'Certificate of Participation',
    organization: 'GOVT. SCIENCE COLLEGE SCIENCE CLUB',
    issued: 'Jan 2022',
    url: cleanExternalUrl(
      'https://drive.google.com/file/d/1oF8Gvi6Egv9L5vSKHfetsncA4iLimgo4/view?usp=sharing'
    ),
    category: 'competition',
    icon: 'award',
  },
  {
    id: 'ndc-first-place',
    title: 'Certificate of Achievement on 1st Place on Project Display',
    organization: 'Notre Dame Science Club',
    issued: 'Mar 2022',
    url: cleanExternalUrl(
      'https://drive.google.com/file/d/17uSu-RSgbFhxGxQ1C4zWimC1p2sT4Uic/view?usp=sharing'
    ),
    category: 'competition',
    icon: 'trophy',
  },
  {
    id: 'ndc-third-web',
    title: 'Certificate of Achievement on 3rd Place on Web Designing',
    organization: 'Notre Dame Science Club',
    issued: 'Mar 2022',
    url: cleanExternalUrl(
      'https://drive.google.com/file/d/16ejkBGh1bvb3_4O0fjtStiiBe8RYHIB9/view?usp=sharing'
    ),
    category: 'competition',
    icon: 'trophy',
  },
  {
    id: 'ieom-presentation',
    title: 'IEOM Society International 7th Bangladeshi International Conference Presentation Certificate',
    organization: 'IEOM Society International',
    issued: 'Dec 2024',
    url: cleanExternalUrl(
      'https://drive.google.com/file/d/1NFTe7I-Nuox_nKS6vo6hCBK1DDJXQAJu/view?usp=sharing'
    ),
    category: 'conference',
    icon: 'presentation',
  },
];

export const achievementFilters: Array<{ id: AchievementFilterId; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'academic', label: 'Academic' },
  { id: 'certification', label: 'Certifications' },
  { id: 'competition', label: 'Competitions' },
  { id: 'conference', label: 'Conference' },
  { id: 'event', label: 'Events' },
];

const FILTER_IDS = achievementFilters.map((item) => item.id);

export function parseAchievementFilter(value?: string | string[]): AchievementFilterId {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && FILTER_IDS.includes(raw as AchievementFilterId)) {
    return raw as AchievementFilterId;
  }
  return 'all';
}

export function parseAchievementYear(value?: string | string[]): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && raw !== 'All Years' ? raw : 'All Years';
}

export function buildAchievementsPath(filter: AchievementFilterId = 'all', year = 'All Years'): string {
  const params = new URLSearchParams();
  if (filter !== 'all') params.set('category', filter);
  if (year !== 'All Years') params.set('year', year);
  const query = params.toString();
  return query ? `/achievements?${query}` : '/achievements';
}
