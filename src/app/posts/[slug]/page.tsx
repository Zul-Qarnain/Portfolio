import { createServerSupabaseClient } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// BlogPost interface matching your database
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  featured_image_url?: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views_count?: number;
  reading_time?: number;
  featured?: boolean;
  tags: string[];
}

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

// Function to increment view count
async function incrementViewCount(postId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current view count
    const { data: currentPost } = await supabase
      .from('blog_posts')
      .select('views_count')
      .eq('id', postId)
      .single();

    if (currentPost) {
      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ 
          views_count: (currentPost.views_count || 0) + 1 
        })
        .eq('id', postId);
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

const PostPage = async ({ params }: PostProps) => {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch the post from Supabase
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !post) {
    notFound();
  }

  // Increment view count (you might want to do this client-side to avoid blocking)
  await incrementViewCount(post.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return 'Technology, Programming';
    return tags.join(', ');
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* Back arrow and category section */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <a href="/posts" className="hover:underline">&larr; Back to Posts</a>
          <span className="mx-2">|</span>
          <span>{formatTags(post.tags)}</span>
        </div>

        {/* Post Title and Date */}
        <div className="text-center mb-8">
          <p className="text-base text-gray-500 dark:text-gray-400 mb-2">
            {formatDate(post.published_at!)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {post.reading_time && <span>{post.reading_time} min read</span>}
            {post.views_count && <span>• {post.views_count} views</span>}
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mr-2">Tags:</span>
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Sharing Buttons */}
        <div className="flex justify-center space-x-4 my-8">
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>

        {/* About the Author section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex-shrink-0">
            <Image
              src="/panjabi.jpeg"
              alt="Author Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">About the Author</h3>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Mohammad Shihab Hossain is an undergraduate Computer Science student at American International University-Bangladesh. He is combining his formal education in computer science with self-taught expertise in Artificial Intelligence, Cybersecurity, and Quantum Computing, actively engaging in research and hands-on learning in these cutting-edge fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

// Generate metadata for SEO
export async function generateMetadata({ params }: PostProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, meta_description, featured_image_url')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.meta_description || post.title,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.title,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}