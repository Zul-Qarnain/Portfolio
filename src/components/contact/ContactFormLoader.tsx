"use client";

import dynamic from 'next/dynamic';

// Dynamically import the ContactForm component, ensuring it's client-side only
const ContactForm = dynamic(() =>
  import('@/components/contact/ContactForm').then((mod) => mod.ContactForm),
{
  ssr: false,
  loading: () => <div className="text-center py-8">Loading Form...</div>, // Optional: add a specific loading UI for the form itself
});

export default function ContactFormLoader() {
  return <ContactForm />;
}
