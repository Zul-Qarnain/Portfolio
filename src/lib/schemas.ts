import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be less than 50 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message must be less than 500 characters." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
});

export const postsSchema = z.array(postSchema);
