import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '../components/Footer'; // ← CHANGE TO RELATIVE IMPORT
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: 'Mohammad Shihab Hossain',
    template: '%s | Mohammad Shihab Hossain',
  },
  description: 'Personal portfolio for Mohammad Shihab Hossain, showcasing his skills, projects, publications, and events.',
  openGraph: {
    title: 'Mohammad Shihab Hossain - Personal Portfolio',
    description: 'Explore the professional journey of Mohammad Shihab Hossain.',
    type: 'website',
    locale: 'en_US',
    url: 'https://shihab.vercel.com', // Replace with actual domain
    siteName: 'Persona',
     images: [ // Add a default OG image if available
      {
        url: 'https://shihab.vercel.com/hadnsomee.jpeg',
      width: 1200,
    height: 630,
     alt: 'Persona Portfolio',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        {/* Script to prevent flash of incorrect theme */}
        <script dangerouslySetInnerHTML={{
          __html: `(function() {
            const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.add(theme);
          })();`
        }} />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          defaultTheme="dark" /* Set to dark to make Dracula the default */
        >
          <Navbar />
          <main className="flex-grow pt-20"> {/* pt-20 for fixed navbar height */}
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
