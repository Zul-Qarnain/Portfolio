"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  meta_description?: string;
  featured_image_url?: string;
  tags?: string[];
  views_count?: number;
  reading_time?: number;
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from local state
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const togglePublished = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === id ? { ...post, status: newStatus } : post
      ));
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post status');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
        
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

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={loadPosts} className="retry-btn">
          🔄 Retry
        </button>
        
        <style jsx>{`
          .error-container {
            text-align: center;
            padding: 3rem;
            color: #ff5555;
            background: rgba(255, 85, 85, 0.1);
            border-radius: 8px;
            border: 1px solid #ff5555;
          }
          .retry-btn {
            background: #bd93f9;
            color: #282a36;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 1rem;
            transition: transform 0.2s ease;
          }
          .retry-btn:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="manage-posts">
      <div className="page-header">
        <div className="header-left">
          <Link href="/adminpacha/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
          <h1>📝 Manage Blog Posts</h1>
        </div>
        <Link href="/adminpacha/dashboard/posts/new" className="new-post-btn">
          ✏️ New Post
        </Link>
      </div>

      <div className="posts-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Posts</h3>
            <span className="stat-number">{posts.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-info">
            <h3>Published</h3>
            <span className="stat-number">{posts.filter(p => p.status === 'published').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Drafts</h3>
            <span className="stat-number">{posts.filter(p => p.status === 'draft').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Archived</h3>
            <span className="stat-number">{posts.filter(p => p.status === 'archived').length}</span>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts found</h3>
          <p>Start by creating your first blog post!</p>
          <Link href="/adminpacha/dashboard/posts/new" className="create-first-btn">
            ✨ Create First Post
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <span className={`status-badge ${post.status}`}>
                  {post.status === 'draft' && '📝'}
                  {post.status === 'published' && '🌟'}
                  {post.status === 'archived' && '📦'}
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>
              
              {post.excerpt && (
                <p className="post-excerpt">{post.excerpt}</p>
              )}
              
              <div className="post-meta">
                <div className="meta-item">
                  <span className="meta-label">📅 Created:</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                {post.views_count !== undefined && (
                  <div className="meta-item">
                    <span className="meta-label">👀 Views:</span>
                    <span>{post.views_count}</span>
                  </div>
                )}
                {post.reading_time && (
                  <div className="meta-item">
                    <span className="meta-label">📖 Read:</span>
                    <span>{post.reading_time} min</span>
                  </div>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="tag-more">+{post.tags.length - 3}</span>
                  )}
                </div>
              )}
              
              <div className="post-actions">
                <Link href={`/adminpacha/dashboard/posts/${post.id}`} className="action-btn edit">
                  ✏️ Edit
                </Link>
                {post.status === 'published' && (
                  <Link href={`/posts/${post.slug}`} target="_blank" className="action-btn view">
                    👁️ View
                  </Link>
                )}
                <button 
                  onClick={() => togglePublished(post.id, post.status)}
                  className={`action-btn ${post.status === 'published' ? 'unpublish' : 'publish'}`}
                >
                  {post.status === 'published' ? '📦 Unpublish' : '🚀 Publish'}
                </button>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="action-btn delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .manage-posts {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .page-header {
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
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          width: fit-content;
        }

        .back-btn:hover {
          background: #50fa7b;
          color: #282a36;
        }
        
        .page-header h1 {
          margin: 0;
          color: #bd93f9;
          font-size: 2rem;
        }
        
        .new-post-btn {
          background: linear-gradient(135deg, #50fa7b 0%, #8be9fd 100%);
          color: #282a36;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 8px rgba(80, 250, 123, 0.3);
        }
        
        .new-post-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(80, 250, 123, 0.4);
        }
        
        .posts-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #44475a 0%, #6272a4 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(189, 147, 249, 0.3);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-info h3 {
          margin: 0 0 0.5rem 0;
          color: #f8f8f2;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #bd93f9;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, rgba(68, 71, 90, 0.5) 0%, rgba(98, 114, 164, 0.3) 100%);
          border-radius: 12px;
          border: 2px dashed #6272a4;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          color: #bd93f9;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .empty-state p {
          color: #f8f8f2;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .create-first-btn {
          background: linear-gradient(135deg, #50fa7b 0%, #8be9fd 100%);
          color: #282a36;
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: transform 0.2s ease;
          display: inline-block;
        }

        .create-first-btn:hover {
          transform: translateY(-2px);
        }
        
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .post-card {
          background: linear-gradient(135deg, #1e1f29 0%, #282a36 100%);
          border: 2px solid #44475a;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }

        .post-card:hover {
          border-color: #bd93f9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(189, 147, 249, 0.2);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .post-title {
          color: #bd93f9;
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.4;
          flex: 1;
        }
        
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          border: 2px solid;
        }
        
        .status-badge.published {
          background: rgba(80, 250, 123, 0.2);
          color: #50fa7b;
          border-color: #50fa7b;
        }
        
        .status-badge.draft {
          background: rgba(255, 184, 108, 0.2);
          color: #ffb86c;
          border-color: #ffb86c;
        }

        .status-badge.archived {
          background: rgba(98, 114, 164, 0.2);
          color: #6272a4;
          border-color: #6272a4;
        }

        .post-excerpt {
          color: #8be9fd;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          opacity: 0.9;
        }

        .post-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(68, 71, 90, 0.3);
          border-radius: 8px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .meta-label {
          color: #6272a4;
          font-weight: 500;
        }

        .meta-item span:last-child {
          color: #f8f8f2;
        }

        .post-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .tag {
          background: rgba(189, 147, 249, 0.2);
          color: #bd93f9;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          border: 1px solid rgba(189, 147, 249, 0.3);
        }

        .tag-more {
          background: rgba(98, 114, 164, 0.2);
          color: #6272a4;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          border: 1px solid rgba(98, 114, 164, 0.3);
        }
        
        .post-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding-top: 1rem;
          border-top: 1px solid #44475a;
        }
        
        .action-btn {
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        
        .action-btn:hover {
          transform: translateY(-1px);
        }
        
        .action-btn.edit {
          background: rgba(139, 233, 253, 0.2);
          color: #8be9fd;
          border: 1px solid #8be9fd;
        }

        .action-btn.view {
          background: rgba(80, 250, 123, 0.2);
          color: #50fa7b;
          border: 1px solid #50fa7b;
        }
        
        .action-btn.publish {
          background: rgba(80, 250, 123, 0.2);
          color: #50fa7b;
          border: 1px solid #50fa7b;
        }
        
        .action-btn.unpublish {
          background: rgba(255, 184, 108, 0.2);
          color: #ffb86c;
          border: 1px solid #ffb86c;
        }
        
        .action-btn.delete {
          background: rgba(255, 85, 85, 0.2);
          color: #ff5555;
          border: 1px solid #ff5555;
        }
        
        @media (max-width: 768px) {
          .manage-posts {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .posts-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .post-actions {
            flex-direction: column;
          }

          .action-btn {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}