"use client";

import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';
import { submitContactForm } from '@/app/contact/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { contactSectionData } from '@/lib/data';
import { useEffect, useActionState } from 'react';
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto" size="lg">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export function ContactForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(submitContactForm, { message: '', type: null, errors: {} });

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (state.type === 'success') {
      toast({
        title: "Message Sent!",
        description: state.message,
        variant: "default", // Or use a custom success variant
      });
      reset(); // Reset form fields
    } else if (state.type === 'error' && state.message && !state.errors) {
       // General error not tied to specific fields
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, reset]);
  

  return (
    <form action={formAction} className="space-y-6 max-w-xl mx-auto">
      <div>
        <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name</Label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          placeholder="John Doe"
          className={errors.name || state.errors?.name ? 'border-destructive' : ''}
          aria-invalid={!!(errors.name || state.errors?.name)}
          aria-describedby="name-error"
        />
        {(errors.name || state.errors?.name) && (
          <p id="name-error" className="mt-1 text-xs text-destructive">
            {errors.name?.message || state.errors?.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="you@example.com"
          className={errors.email || state.errors?.email ? 'border-destructive' : ''}
          aria-invalid={!!(errors.email || state.errors?.email)}
          aria-describedby="email-error"
        />
        {(errors.email || state.errors?.email) && (
          <p id="email-error" className="mt-1 text-xs text-destructive">
            {errors.email?.message || state.errors?.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</Label>
        <Textarea
          id="message"
          {...register('message')}
          rows={5}
          placeholder="Your message here..."
          className={errors.message || state.errors?.message ? 'border-destructive' : ''}
          aria-invalid={!!(errors.message || state.errors?.message)}
          aria-describedby="message-error"
        />
        {(errors.message || state.errors?.message) && (
          <p id="message-error" className="mt-1 text-xs text-destructive">
            {errors.message?.message || state.errors?.message}
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SubmitButton />
        <p className="text-xs text-muted-foreground text-center sm:text-right">
          {contactSectionData.note}
        </p>
      </div>
    </form>
  );
}
