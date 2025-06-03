"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import RichTextEditor from '../../../../../components/RichTextEditor';

// Define types directly in this file for now
interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  meta_keywords?: string;
  featured_image_url?: string;
  author_id?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  views_count?: number;
  reading_time?: number;
  featured?: boolean;
  tags: string[];
}

export default function NewPostPage() {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    meta_description: '',
    meta_keywords: '',
    featured_image_url: '',
    status: 'draft',
    tags: [], // Now properly typed as string[]
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string): void => {
    setPost({
      ...post,
      title,
      slug: generateSlug(title),
    });
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleTagsChange = (tagsString: string): void => {
    const tagsArray: string[] = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    setPost({
      ...post,
      tags: tagsArray
    });
  };

  const savePost = async (status: 'draft' | 'published'): Promise<void> => {
    setSaving(true);
    setError('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const postData = {
        ...post,
        status,
        author_id: user.id,
        reading_time: calculateReadingTime(post.content),
        published_at: status === 'published' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      // Trigger sitemap regeneration
      if (status === 'published') {
        try {
          await fetch('/api/sitemap/regenerate', { method: 'POST' });
          await fetch('/api/seo/ping-google', { method: 'POST' });
        } catch (seoError) {
          console.warn('SEO operations failed:', seoError);
          // Don't fail the whole operation for SEO errors
        }
      }

      router.push(`/adminpacha/dashboard/posts/${data.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error saving post:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="new-post-page">
      <div className="post-header">
        <h1>✍️ Create New Blog Post</h1>
        <div className="post-actions">
          <button 
            onClick={() => savePost('draft')}
            disabled={saving || !post.title.trim()}
            className="draft-btn"
          >
            💾 Save Draft
          </button>
          <button 
            onClick={() => savePost('published')}
            disabled={saving || !post.title.trim() || !post.content.trim()}
            className="publish-btn"
          >
            🚀 Publish Now
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="post-form">
        <div className="form-section">
          <label className="form-label">Post Title</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter an engaging title..."
            className="title-input"
            disabled={saving}
          />
        </div>

        <div className="form-section">
          <label className="form-label">URL Slug (SEO)</label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            placeholder="url-friendly-slug"
            className="slug-input"
            disabled={saving}
          />
          <small className="input-hint">
            📍 Your post will be available at: /blog/{post.slug || 'your-slug'}
          </small>
        </div>

        <div className="form-section">
          <label className="form-label">Content</label>
          <RichTextEditor
            content={post.content}
            onChange={(content: string) => setPost({ ...post, content })}
            placeholder="Start writing your amazing blog post..."
          />
        </div>

        <div className="seo-section">
          <h3>🔍 SEO Settings</h3>
          
          <div className="form-section">
            <label className="form-label">Meta Description (160 chars max)</label>
            <textarea
              value={post.meta_description || ''}
              onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
              placeholder="Brief description for search engines..."
              className="meta-textarea"
              maxLength={160}
              disabled={saving}
            />
            <small className="char-count">
              {(post.meta_description || '').length}/160 characters
            </small>
          </div>

          <div className="form-section">
            <label className="form-label">Featured Image URL</label>
            <input
              type="url"
              value={post.featured_image_url || ''}
              onChange={(e) => setPost({ ...post, featured_image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="image-input"
              disabled={saving}
            />
          </div>

          <div className="form-section">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              value={post.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="nextjs, react, web development"
              className="tags-input"
              disabled={saving}
            />
            <small className="input-hint">
              Current tags: {post.tags.length > 0 ? post.tags.map(tag => `#${tag}`).join(' ') : 'None'}
            </small>
          </div>
        </div>
      </div>

      <style jsx>{`
        .new-post-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #44475a;
        }

        .post-header h1 {
          margin: 0;
          color: #bd93f9;
          font-size: 2rem;
        }

        .post-actions {
          display: flex;
          gap: 1rem;
        }

        .draft-btn, .publish-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .draft-btn {
          background: #6272a4;
          color: #f8f8f2;
        }

        .publish-btn {
          background: linear-gradient(135deg, #50fa7b 0%, #8be9fd 100%);
          color: #282a36;
        }

        .draft-btn:hover:not(:disabled) {
          background: #44475a;
        }

        .publish-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(80, 250, 123, 0.3);
        }

        .draft-btn:disabled, .publish-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .error-banner {
          background: linear-gradient(135deg, rgba(255, 85, 85, 0.2) 0%, rgba(255, 85, 85, 0.1) 100%);
          color: #ff5555;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 85, 85, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .post-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          color: #f8f8f2;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .title-input, .slug-input, .image-input, .tags-input {
          padding: 1rem;
          background: #1e1f29;
          border: 2px solid #44475a;
          border-radius: 8px;
          color: #f8f8f2;
          font-size: 1.1rem;
          transition: border-color 0.2s ease;
          font-family: inherit;
        }

        .title-input {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .title-input:focus, .slug-input:focus, .image-input:focus, .tags-input:focus, .meta-textarea:focus {
          outline: none;
          border-color: #bd93f9;
          box-shadow: 0 0 0 3px rgba(189, 147, 249, 0.2);
        }

        .title-input:disabled, .slug-input:disabled, .image-input:disabled, .tags-input:disabled, .meta-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .meta-textarea {
          padding: 1rem;
          background: #1e1f29;
          border: 2px solid #44475a;
          border-radius: 8px;
          color: #f8f8f2;
          font-size: 1rem;
          min-height: 80px;
          resize: vertical;
          font-family: inherit;
        }

        .input-hint, .char-count {
          color: #6272a4;
          font-size: 0.9rem;
        }

        .char-count {
          text-align: right;
        }

        .seo-section {
          background: rgba(189, 147, 249, 0.1);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(189, 147, 249, 0.3);
        }

        .seo-section h3 {
          margin: 0 0 1.5rem 0;
          color: #bd93f9;
          font-size: 1.3rem;
        }

        @media (max-width: 768px) {
          .post-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .post-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}