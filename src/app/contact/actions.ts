"use server";

import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';
import { createServerSupabaseClient } from '@/lib/supabase';
import { headers } from 'next/headers';

interface FormState {
  message: string;
  type: 'success' | 'error' | null;
  errors?: Partial<Record<keyof ContactFormValues, string>>;
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  };

  const validatedFields = contactFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    validatedFields.error.errors.forEach(err => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as keyof ContactFormValues] = err.message;
      }
    });
    return {
      message: "Please correct the errors in the form.",
      type: 'error',
      errors: fieldErrors,
    };
  }

  try {
    // Removed strict env check to allow fallback in lib/supabase.ts to work
    
    const supabase = await createServerSupabaseClient();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    const { name, email, message } = validatedFields.data;

    // Call the secure database function
    const { data, error } = await supabase.rpc('submit_contact_message', {
      p_name: name,
      p_email: email,
      p_message: message,
      p_ip: ip
    });

    if (error) {
      console.error("Error calling submit_contact_message:", error);
      // Fallback to direct insert if RPC fails (e.g. if user didn't run SQL)
      // This is a fallback to help debug or make it work if RLS allows
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          user_name: name,
          user_email: email,
          message_content: message,
          client_ip: ip,
          status: 'unread'
        });
      
      if (insertError) {
        console.error("Direct insert also failed:", insertError);
        throw new Error("Failed to save message: " + insertError.message);
      }
      
      return {
        message: "Thank you for your message! I'll get back to you as soon as possible.",
        type: 'success',
      };
    }

    // Handle case where data is null/undefined (RPC void return or error)
    if (!data) {
       return {
        message: "Thank you for your message! I'll get back to you as soon as possible.",
        type: 'success',
      };
    }

    // The function returns a JSON object with success/message
    if (data.success === false) {
      return {
        message: data.message || "You already have a pending message.",
        type: 'error',
      };
    }

    return {
      message: "Thank you for your message! I'll get back to you as soon as possible.",
      type: 'success',
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      type: 'error',
    };
  }
}
