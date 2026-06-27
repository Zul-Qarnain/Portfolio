
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Mail } from 'lucide-react';
import ContactFormLoader from '@/components/contact/ContactFormLoader'; // Import the new client component

export const metadata: Metadata = {
  title: 'Contact Me',
  description: 'Get in touch with me. Send a message through the contact form for inquiries, collaborations, or just to say hi.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <section id="contact" className="section-container">
      <div className="text-center mb-12">
        <Mail className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline text-foreground sm:text-5xl">
          Get In <span className="text-primary">Touch</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question, a project idea, or just want to connect? Feel free to reach out. I&apos;m always open to discussing new opportunities and collaborations.
        </p>
      </div>
      <Suspense fallback={<div className="text-center py-8">Preparing contact form...</div>}>
        <ContactFormLoader />
      </Suspense>
    </section>
  );
}
