"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// BlogPost interface matching your exact database schema
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  meta_keywords?: string;
  featured_image_url?: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  reading_time: number;
  featured: boolean;
  tags: string[];
}

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.meta_description && post.meta_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPostDescription = (post: BlogPost) => {
    if (post.excerpt) return post.excerpt;
    if (post.meta_description) return post.meta_description;
    // Extract first 150 characters from content, removing HTML tags
    const textContent = post.content.replace(/<[^>]*>/g, '');
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Writing on Machine Learning, Advance Math, and Programming</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        All my articles are written with the goal of helping you learn something new. I hope you enjoy them!
      </p>

      {/* Search Bar */}
      <div className="mb-12 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {searchTerm ? 'No posts found' : 'No published posts yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new content!'}
          </p>
        </div>
      ) : (
        <>
          {/* Posts count */}
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? `Found ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}` : `${filteredPosts.length} published post${filteredPosts.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="w-full max-w-2xl mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {post.featured_image_url && (
                  <div className="relative w-full h-60">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-md"
                    />
                    {post.featured && (
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="hover:text-purple-600 transition-colors duration-200">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatDate(post.published_at!)}</span>
                    {post.reading_time > 0 && (
                      <span>• {post.reading_time} min read</span>
                    )}
                    {post.views_count > 0 && (
                      <span>• {post.views_count} views</span>
                    )}
                  </div>
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {getPostDescription(post)}
                  </p>
                  <Link 
                    href={`/posts/${post.slug}`} 
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 dark:focus:ring-purple-800 transition-all duration-200 hover:shadow-md"
                  >
                    Read more <span className="ml-2 text-lg">→</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PostsPage;