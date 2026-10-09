import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Source_Code_Pro, Press_Start_2P, VT323 } from "next/font/google";
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteBackground } from '@/components/SiteBackground';
import { SiteChrome } from '@/components/SiteChrome';
import { VisitTracker } from '@/components/VisitTracker';
import { WebMCPProvider } from '@/components/WebMCPProvider';
import { siteUrl } from '@/lib/seo';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code-pro", display: "swap" });
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start-2p", display: "swap" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323", display: "swap" });

const SITE = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
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
    'Next.js',
    'Machine Learning',
    'Data Science',
  ],
  authors: [{ name: 'Mohammad Shihab Hossain', url: SITE }],
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
  // No canonical here: App Router merges layout metadata into every route that
  // does not declare its own, so a canonical of "/" here made sub-pages (and
  // redirects such as /anime-demo) claim the homepage as their canonical URL.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Mohammad Shihab Hossain - Personal Portfolio',
    description: 'Explore the professional portfolio of Mohammad Shihab Hossain, an aspiring AI & Software Developer. Discover his latest projects, research publications, and expertise in machine learning, full-stack web development, and problem solving.',
    type: 'website',
    locale: 'en_US',
    url: SITE,
    siteName: 'Mohammad Shihab Hossain',
    images: [
      {
        url: `${SITE}/mypic-square.jpeg`,
        width: 1023,
        height: 1023,
        alt: 'Mohammad Shihab Hossain',
      },
      {
        url: `${SITE}/mypic.jpeg`,
        width: 1023,
        height: 1537,
        alt: 'Mohammad Shihab Hossain (Portrait)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammad Shihab Hossain - AI & Software Developer',
    description: 'Explore the professional portfolio of Mohammad Shihab Hossain. Projects, research publications, achievements, and technical expertise.',
    images: [`${SITE}/mypic-square.jpeg`],
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
        {/* Performance Preconnect Resource Hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Direct Google Search Thumbnail Link Signals */}
        <meta name="thumbnail" content={`${SITE}/mypic-square.jpeg`} />
        <link rel="image_src" href={`${SITE}/mypic-square.jpeg`} />

        {/* Script to prevent flash of incorrect theme */}
        <script dangerouslySetInnerHTML={{
          __html: `(function() {
            const theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.classList.add(theme === 'light' ? 'light' : 'dark');
          })();`
        }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable} ${pressStart2P.variable} ${vt323.variable} font-body antialiased flex flex-col min-h-screen relative overflow-x-hidden`}>
        <SiteBackground />

        {/* Google Analytics (lazy loaded for maximum page performance) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CD4EGC56J2"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CD4EGC56J2');
          `}
        </Script>

        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <WebMCPProvider />
          <VisitTracker />
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <main className="flex-grow">
            {children}
          </main>
          <SiteChrome>
            <Footer />
          </SiteChrome>
          <Toaster />
          <SiteChrome>
            <ScrollToTop />
          </SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
