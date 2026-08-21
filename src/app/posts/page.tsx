import type { Metadata } from 'next';
import PostsSearchClient from '@/components/posts/PostsSearchClient';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Posts',
  description:
    'Articles on Machine Learning, Advanced Math, and Programming by Mohammad Shihab Hossain.',
  alternates: {
    canonical: '/posts',
  },
};

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Writing on Machine Learning, Advance Math, and Programming
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        All my articles are written with the goal of helping you learn something new. I hope you
        enjoy them!
      </p>

      <PostsSearchClient posts={posts} />
    </div>
  );
}
