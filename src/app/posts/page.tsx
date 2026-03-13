import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import PostsSearchClient from '@/components/posts/PostsSearchClient';

export const metadata: Metadata = {
  title: 'Posts',
  description:
    'Articles on Machine Learning, Advanced Math, and Programming by Mohammad Shihab Hossain.',
};

// Server-side Supabase client (no cookies needed for public read)
async function fetchPublishedPosts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

export default async function PostsPage() {
  const posts = await fetchPublishedPosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Writing on Machine Learning, Advance Math, and Programming
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        All my articles are written with the goal of helping you learn something new. I hope you
        enjoy them!
      </p>

      {/* Client component handles search interactivity; posts HTML is in the server-rendered page */}
      <PostsSearchClient posts={posts} />
    </div>
  );
}