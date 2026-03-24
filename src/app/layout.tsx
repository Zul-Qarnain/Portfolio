import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Source_Code_Pro } from "next/font/google";
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/ScrollToTop";
import GalaxyBackground from '@/components/GalaxyBackground';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code-pro" });

export const metadata: Metadata = {
  metadataBase: new URL('https://shihab.vercel.app'),
  title: {
    default: 'Mohammad Shihab Hossain',
    template: '%s | Mohammad Shihab Hossain',
  },
  description: 'Explore the professional portfolio of Mohammad Shihab Hossain, an aspiring AI & Software Developer. Discover his latest projects, research publications, and expertise in machine learning, full-stack web development, and problem solving.',
  keywords: [
    'Mohammad Shihab Hossain',
    'Shihab Hossain',
    'Mohammad Shihab',
    'Md Shihab Hossain',
    'Md Shihab',
    'Shihab',
    'Software Developer',
    'AI Developer',
    'Portfolio',
    'Web Developer',
    'React',
    'Next.js'
  ],
  authors: [{ name: 'Mohammad Shihab Hossain', url: 'https://shihab.vercel.app' }],
  creator: 'Mohammad Shihab Hossain',
  publisher: 'Mohammad Shihab Hossain',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/mypic.jpeg',
    apple: '/mypic.jpeg',
  },
  openGraph: {
    title: 'Mohammad Shihab Hossain - Personal Portfolio',
    description: 'Explore the professional portfolio of Mohammad Shihab Hossain, an aspiring AI & Software Developer. Discover his latest projects, research publications, and expertise in machine learning, full-stack web development, and problem solving.',
    type: 'website',
    locale: 'en_US',
    url: 'https://shihab.vercel.app', // Replace with actual domain
    siteName: 'Mohammad Shihab Hossain',
    images: [
      {
        url: 'https://shihab.vercel.app/mypic.jpeg',
        width: 1200,
        height: 630,
        alt: 'Mohammad Shihab Hossain',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to prevent flash of incorrect theme */}
        <script dangerouslySetInnerHTML={{
          __html: `(function() {
            const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.add(theme);
          })();`
        }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable} font-body antialiased flex flex-col min-h-screen relative overflow-x-hidden`}>
        <GalaxyBackground />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CD4EGC56J2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CD4EGC56J2');
          `}
        </Script>

        <ThemeProvider
          defaultTheme="dark" /* Set to dark to make Dracula the default */
        >
          <Navbar />
          <main className="flex-grow pt-20"> {/* pt-20 for fixed navbar height */}
            {children}
          </main>
          <Footer />
          <Toaster />
          <ScrollToTop />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Mohammad Shihab Hossain",
              "url": "https://shihab.vercel.app",
              "image": "https://shihab.vercel.app/mypic.jpeg",
              "jobTitle": "Computer Science Student & Software Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "American International University-Bangladesh"
              },
              "alumniOf": "American International University-Bangladesh",
              "sameAs": [
                "https://github.com/Zul-Qarnain",
                "https://www.linkedin.com/in/zul-qarnain20/",
                "https://orcid.org/0009-0007-0212-6562",
                "https://www.researchgate.net/profile/Mohammad-Hossian-2",
                "https://aiub.academia.edu/MohammadShihabHossian",
                "https://scholar.google.com/citations?user=RebPXvAAAAAJ",
                "https://www.semanticscholar.org/author/Mohammad-Shihab-Hossain/2354509770",
                "https://stackoverflow.com/users/14467410/mohammod-shihab-hossain",
                "https://sciprofiles.com/profile/mdshihab",
                "https://loop.frontiersin.org/people/3299583/overview",
                "https://dev.to/zulqarnain_15",
                "https://medium.com/@mdshihab.dev",
                "https://www.kaggle.com/shihabdev20",
                "https://www.credly.com/users/shihab",
                "https://gitlab.com/Zul-Qarnain02",
                "https://gravatar.com/zulqarnain20",
                "https://linktr.ee/shihab.dev",
                "https://about.me/mdshihab.dev",
                "https://index.ieomsociety.org/index.cfm/author/view/ID/3B8DAFF4-CD92-2CE9-624E9D4FBE3B654C"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
