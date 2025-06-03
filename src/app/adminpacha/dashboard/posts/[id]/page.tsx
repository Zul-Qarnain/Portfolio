"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
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
    if (post) {
      setPost({
        ...post,
        title,
        slug: generateSlug(title),
      });
    }
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleTagsChange = (tagsString: string): void => {
    if (post) {
      const tagsArray: string[] = tagsString
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      setPost({
        ...post,
        tags: tagsArray
      });
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Post not found');

      setPost(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load post';
      setError(errorMessage);
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (status?: 'draft' | 'published'): Promise<void> => {
    if (!post) return;

    setSaving(true);
    setError('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateData = {
        ...post,
        status: status || post.status,
        reading_time: calculateReadingTime(post.content),
        updated_at: new Date().toISOString(),
        published_at: (status === 'published' && post.status !== 'published') 
          ? new Date().toISOString() 
          : post.published_at,
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setPost(data);
      setIsEditing(false);

      // Trigger sitemap regeneration if published
      if (status === 'published') {
        try {
          await fetch('/api/sitemap/regenerate', { method: 'POST' });
          await fetch('/api/seo/ping-google', { method: 'POST' });
        } catch (seoError) {
          console.warn('SEO operations failed:', seoError);
        }
      }

      // Show success message
      alert('Post saved successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error saving post:', err);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (): Promise<void> => {
    if (!post || !confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      router.push('/adminpacha/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      console.error('Error deleting post:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #6272a4;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #44475a;
            border-top: 4px solid #bd93f9;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist or you don't have permission to access it.</p>
        <button onClick={() => router.push('/adminpacha/dashboard')}>← Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="edit-post-page">
      <div className="post-header">
        <div className="header-left">
          <button 
            onClick={() => router.push('/adminpacha/dashboard')}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
          <div className="post-info">
            <h1>{isEditing ? '✏️ Editing Post' : '📖 Viewing Post'}</h1>
            <span className={`status-badge ${post.status}`}>
              {post.status === 'draft' ? '📝' : post.status === 'published' ? '🌟' : '📦'} {post.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="post-actions">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-btn"
                disabled={saving}
              >
                ✏️ Edit
              </button>
              {post.status === 'published' && (
                <button 
                  onClick={() => window.open(`/posts/${post.slug}`, '_blank')}
                  className="view-btn"
                >
                  👁️ View Live
                </button>
              )}
              <button 
                onClick={() => savePost(post.status === 'published' ? 'draft' : 'published')}
                className={post.status === 'published' ? 'unpublish-btn' : 'publish-btn'}
                disabled={saving}
              >
                {post.status === 'published' ? '📦 Unpublish' : '🚀 Publish'}
              </button>
              <button 
                onClick={deletePost}
                className="delete-btn"
                disabled={saving}
              >
                🗑️ Delete
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => savePost()}
                disabled={saving || !post.title.trim()}
                className="save-btn"
              >
                💾 Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  loadPost(); // Reload original data
                }}
                className="cancel-btn"
                disabled={saving}
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="post-content">
        {!isEditing ? (
          <div className="view-mode">
            <div className="post-meta">
              <p><strong>📅 Created:</strong> {new Date(post.created_at || '').toLocaleDateString()}</p>
              {post.updated_at && (
                <p><strong>📝 Updated:</strong> {new Date(post.updated_at).toLocaleDateString()}</p>
              )}
              {post.published_at && (
                <p><strong>🌟 Published:</strong> {new Date(post.published_at).toLocaleDateString()}</p>
              )}
              <p><strong>📖 Reading Time:</strong> {post.reading_time || 0} min</p>
              <p><strong>👀 Views:</strong> {post.views_count || 0}</p>
            </div>

            <div className="post-details">
              <div className="detail-section">
                <h3>Title</h3>
                <p>{post.title}</p>
              </div>

              <div className="detail-section">
                <h3>Slug</h3>
                <p>/posts/{post.slug}</p>
              </div>

              <div className="detail-section">
                <h3>Content</h3>
                <div className="content-preview" dangerouslySetInnerHTML={{ __html: post.content }}></div>
              </div>

              {post.excerpt && (
                <div className="detail-section">
                  <h3>Excerpt</h3>
                  <p>{post.excerpt}</p>
                </div>
              )}

              {post.meta_description && (
                <div className="detail-section">
                  <h3>Meta Description</h3>
                  <p>{post.meta_description}</p>
                </div>
              )}

              {post.featured_image_url && (
                <div className="detail-section">
                  <h3>Featured Image</h3>
                  <img src={post.featured_image_url} alt={post.title} className="featured-image-preview" />
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="detail-section">
                  <h3>Tags</h3>
                  <div className="tags-display">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-mode">
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
                  📍 Your post will be available at: /posts/{post.slug || 'your-slug'}
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
                  <label className="form-label">Excerpt (Optional)</label>
                  <textarea
                    value={post.excerpt || ''}
                    onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                    placeholder="Brief excerpt for post previews..."
                    className="meta-textarea"
                    disabled={saving}
                  />
                </div>
                
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
          </div>
        )}
      </div>

      <style jsx>{`
        .edit-post-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #44475a;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .back-btn {
          background: #6272a4;
          color: #f8f8f2;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .back-btn:hover {
          background: #50fa7b;
          color: #282a36;
        }

        .post-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .post-info h1 {
          color: #bd93f9;
          font-size: 2rem;
          margin: 0;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 2px solid;
        }

        .status-badge.draft {
          background: rgba(255, 184, 108, 0.2);
          color: #ffb86c;
          border-color: #ffb86c;
        }

        .status-badge.published {
          background: rgba(80, 250, 123, 0.2);
          color: #50fa7b;
          border-color: #50fa7b;
        }

        .status-badge.archived {
          background: rgba(98, 114, 164, 0.2);
          color: #6272a4;
          border-color: #6272a4;
        }

        .post-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .edit-btn, .view-btn, .publish-btn, .unpublish-btn, .delete-btn, .save-btn, .cancel-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.9rem;
        }

        .edit-btn {
          background: #8be9fd;
          color: #282a36;
        }

        .view-btn {
          background: #50fa7b;
          color: #282a36;
        }

        .publish-btn {
          background: #50fa7b;
          color: #282a36;
        }

        .unpublish-btn {
          background: #ffb86c;
          color: #282a36;
        }

        .delete-btn {
          background: #ff5555;
          color: #f8f8f2;
        }

        .save-btn {
          background: #50fa7b;
          color: #282a36;
        }

        .cancel-btn {
          background: #6272a4;
          color: #f8f8f2;
        }

        .edit-btn:hover, .view-btn:hover, .publish-btn:hover, .save-btn:hover {
          transform: translateY(-1px);
        }

        .unpublish-btn:hover, .cancel-btn:hover {
          transform: translateY(-1px);
        }

        .delete-btn:hover {
          transform: translateY(-1px);
          background: #ff7979;
        }

        .edit-btn:disabled, .view-btn:disabled, .publish-btn:disabled, .unpublish-btn:disabled, 
        .delete-btn:disabled, .save-btn:disabled, .cancel-btn:disabled {
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

        .post-meta {
          background: linear-gradient(135deg, rgba(189, 147, 249, 0.1) 0%, rgba(139, 233, 253, 0.1) 100%);
          border: 1px solid rgba(189, 147, 249, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .post-meta p {
          color: #f8f8f2;
          margin: 0.5rem 0;
        }

        .post-details {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .detail-section {
          background: linear-gradient(135deg, #1e1f29 0%, #282a36 100%);
          border: 2px solid #44475a;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .detail-section h3 {
          color: #bd93f9;
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
        }

        .detail-section p {
          color: #f8f8f2;
          line-height: 1.6;
          margin: 0;
        }

        .content-preview {
          color: #f8f8f2;
          line-height: 1.6;
        }

        .content-preview h1, .content-preview h2, .content-preview h3 {
          color: #bd93f9;
        }

        .featured-image-preview {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .tags-display {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag {
          background: rgba(189, 147, 249, 0.2);
          color: #bd93f9;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          border: 1px solid rgba(189, 147, 249, 0.3);
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
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .char-count {
          text-align: right;
        }

        .seo-section {
          background: linear-gradient(135deg, rgba(139, 233, 253, 0.1) 0%, rgba(139, 233, 253, 0.05) 100%);
          border: 2px solid rgba(139, 233, 253, 0.3);
          border-radius: 12px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .seo-section h3 {
          color: #8be9fd;
          margin: 0 0 1.5rem 0;
          font-size: 1.3rem;
        }

        .error-container {
          text-align: center;
          padding: 3rem;
          color: #f8f8f2;
        }

        .error-container h1 {
          color: #ff5555;
          margin-bottom: 1rem;
        }

        .error-container button {
          background: #bd93f9;
          color: #282a36;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          margin-top: 2rem;
        }

        .error-container button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(189, 147, 249, 0.3);
        }

        @media (max-width: 768px) {
          .edit-post-page {
            padding: 1rem;
          }

          .post-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .post-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .post-info h1 {
            font-size: 1.5rem;
          }

          .post-actions {
            justify-content: center;
          }

          .title-input {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}