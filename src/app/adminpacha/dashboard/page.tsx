"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// BlogPost interface
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
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  views_count?: number;
  reading_time?: number;
  featured?: boolean;
  tags: string[];
}

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [draftPosts, setDraftPosts] = useState<BlogPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [loadingPublished, setLoadingPublished] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Move these functions outside useEffect so they can be reused
  const loadStats = async () => {
    try {
      // Get total posts count
      const { count: totalCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Get published posts count
      const { count: publishedCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get draft posts count
      const { count: draftCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // Get total views
      const { data: viewsData } = await supabase
        .from('blog_posts')
        .select('views_count');

      const totalViews = viewsData?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0;

      setStats({
        totalPosts: totalCount || 0,
        publishedPosts: publishedCount || 0,
        draftPosts: draftCount || 0,
        totalViews
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadDraftPosts = async () => {
    try {
      setLoadingDrafts(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setDraftPosts(data || []);
    } catch (error) {
      console.error("Error loading draft posts:", error);
    } finally {
      setLoadingDrafts(false);
    }
  };

  const loadPublishedPosts = async () => {
    try {
      setLoadingPublished(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPublishedPosts(data || []);
    } catch (error) {
      console.error("Error loading published posts:", error);
    } finally {
      setLoadingPublished(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/adminpacha");
          return;
        }

        setUser(user);
        await Promise.all([loadStats(), loadDraftPosts(), loadPublishedPosts()]);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/adminpacha");
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push("/adminpacha");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  const getContentPreview = (content: string) => {
    // Remove HTML tags and get first 100 characters
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
  };

  const publishDraft = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString() 
        })
        .eq('id', postId);

      if (error) throw error;

      // Reload all data
      await Promise.all([loadStats(), loadDraftPosts(), loadPublishedPosts()]);
      
      // Show success message
      alert('Post published successfully! 🚀');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post. Please try again.');
    }
  };

  const unpublishPost = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to unpublish "${title}"? It will be moved to drafts.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'draft',
          published_at: null 
        })
        .eq('id', postId);

      if (error) throw error;

      // Reload all data
      await Promise.all([loadStats(), loadDraftPosts(), loadPublishedPosts()]);
      
      alert('Post unpublished successfully.');
    } catch (error) {
      console.error('Error unpublishing post:', error);
      alert('Failed to unpublish post. Please try again.');
    }
  };

  const deleteDraft = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Reload all data
      await Promise.all([loadStats(), loadDraftPosts(), loadPublishedPosts()]);
      
      alert('Draft deleted successfully.');
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft. Please try again.');
    }
  };

  const deletePublishedPost = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the published post "${title}"? This action cannot be undone and will remove it from your website.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Reload all data
      await Promise.all([loadStats(), loadDraftPosts(), loadPublishedPosts()]);
      
      // Trigger sitemap regeneration since a published post was deleted
      try {
        await fetch('/api/sitemap/regenerate', { 
          method: 'POST',
          credentials: 'include'
        });
        await fetch('/api/seo/ping-google', { 
          method: 'POST',
          credentials: 'include'
        });
      } catch (seoError) {
        console.warn('SEO operations failed:', seoError);
      }
      
      alert('Published post deleted successfully.');
    } catch (error) {
      console.error('Error deleting published post:', error);
      alert('Failed to delete published post. Please try again.');
    }
  };

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
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

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>🧛‍♂️ Welcome to Your Blog Command Center</h1>
        <p>Manage your blog empire with the power of darkness...</p>
        
        <div className="user-info">
          <div className="user-card">
            <h3>👤 Admin Profile</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Last Login:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2>📊 Blog Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalPosts}</div>
              <div className="stat-label">Total Posts</div>
            </div>
          </div>

          <div className="stat-card published">
            <div className="stat-icon">🌟</div>
            <div className="stat-info">
              <div className="stat-number">{stats.publishedPosts}</div>
              <div className="stat-label">Published</div>
            </div>
          </div>

          <div className="stat-card draft">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <div className="stat-number">{stats.draftPosts}</div>
              <div className="stat-label">Drafts</div>
            </div>
          </div>

          <div className="stat-card views">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalViews}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Published Posts Section */}
      <div className="published-section">
        <div className="section-header">
          <h2>🌟 Your Published Posts</h2>
          <button 
            onClick={() => router.push('/adminpacha/dashboard/posts?filter=published')}
            className="view-all-btn-header"
          >
            📚 View All Published
          </button>
        </div>

        {loadingPublished ? (
          <div className="posts-loading">
            <div className="loading-spinner-small"></div>
            <p>Loading published posts...</p>
          </div>
        ) : publishedPosts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">🌟</div>
            <h3>No published posts yet</h3>
            <p>Publish your first post to see it here!</p>
          </div>
        ) : (
          <div className="posts-grid">
            {publishedPosts.map((post) => (
              <div key={post.id} className="post-card published">
                <div className="post-header">
                  <h3 className="post-title">{post.title || 'Untitled Post'}</h3>
                  <div className="post-status">
                    <span className="post-date">{formatDate(post.published_at || post.created_at)}</span>
                    <span className="status-badge published">🌟 Published</span>
                  </div>
                </div>
                
                <div className="post-content">
                  <p className="post-preview">
                    {post.content ? getContentPreview(post.content) : 'No content...'}
                  </p>
                  
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
                </div>
                
                <div className="post-meta">
                  <span className="reading-time">
                    ⏱️ {post.reading_time || 0} min read
                  </span>
                  <span className="views-count">
                    👁️ {post.views_count || 0} views
                  </span>
                </div>
                
                <div className="post-actions">
                  <button 
                    onClick={() => router.push(`/adminpacha/dashboard/posts/${post.id}`)}
                    className="action-btn edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => window.open(`/posts/${post.slug}`, '_blank')}
                    className="action-btn view"
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => unpublishPost(post.id, post.title)}
                    className="action-btn unpublish"
                  >
                    📦 Unpublish
                  </button>
                  <button 
                    onClick={() => deletePublishedPost(post.id, post.title)}
                    className="action-btn delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {publishedPosts.length > 0 && (
          <div className="view-all-published">
            <button 
              onClick={() => router.push('/adminpacha/dashboard/posts?filter=published')}
              className="view-all-btn"
            >
              📚 View All Published Posts ({stats.publishedPosts})
            </button>
          </div>
        )}
      </div>

      {/* Draft Posts Section */}
      <div className="drafts-section">
        <div className="section-header">
          <h2>📝 Your Draft Posts</h2>
          <button 
            onClick={() => router.push('/adminpacha/dashboard/posts/new')}
            className="new-post-btn"
          >
            ✍️ New Post
          </button>
        </div>

        {loadingDrafts ? (
          <div className="posts-loading">
            <div className="loading-spinner-small"></div>
            <p>Loading drafts...</p>
          </div>
        ) : draftPosts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📝</div>
            <h3>No draft posts yet</h3>
            <p>Start writing your next masterpiece!</p>
            <button 
              onClick={() => router.push('/adminpacha/dashboard/posts/new')}
              className="create-first-post-btn"
            >
              ✍️ Create Your First Post
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {draftPosts.map((post) => (
              <div key={post.id} className="post-card draft">
                <div className="post-header">
                  <h3 className="post-title">{post.title || 'Untitled Post'}</h3>
                  <div className="post-status">
                    <span className="post-date">{formatDate(post.updated_at)}</span>
                    <span className="status-badge draft">📝 Draft</span>
                  </div>
                </div>
                
                <div className="post-content">
                  <p className="post-preview">
                    {post.content ? getContentPreview(post.content) : 'No content yet...'}
                  </p>
                  
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
                </div>
                
                <div className="post-meta">
                  <span className="reading-time">
                    ⏱️ {post.reading_time || 0} min read
                  </span>
                  <span className="word-count">
                    📝 {post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0} words
                  </span>
                </div>
                
                <div className="post-actions">
                  <button 
                    onClick={() => router.push(`/adminpacha/dashboard/posts/${post.id}`)}
                    className="action-btn edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => publishDraft(post.id)}
                    className="action-btn publish"
                    disabled={!post.title || !post.content}
                  >
                    🚀 Publish
                  </button>
                  <button 
                    onClick={() => deleteDraft(post.id, post.title)}
                    className="action-btn delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {draftPosts.length > 0 && (
          <div className="view-all-drafts">
            <button 
              onClick={() => router.push('/adminpacha/dashboard/posts?filter=draft')}
              className="view-all-btn"
            >
              📚 View All Drafts ({stats.draftPosts})
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button 
            onClick={() => router.push('/adminpacha/dashboard/posts/new')}
            className="action-btn-large create"
          >
            <span className="action-icon">✍️</span>
            <span className="action-text">
              <strong>Create New Post</strong>
              <small>Start writing your next masterpiece</small>
            </span>
          </button>

          <button 
            onClick={() => router.push('/adminpacha/dashboard/posts')}
            className="action-btn-large manage"
          >
            <span className="action-icon">📚</span>
            <span className="action-text">
              <strong>Manage All Posts</strong>
              <small>Edit, publish, or delete posts</small>
            </span>
          </button>

          <button 
            onClick={() => router.push('/adminpacha/dashboard/analytics')}
            className="action-btn-large analytics"
          >
            <span className="action-icon">📈</span>
            <span className="action-text">
              <strong>Analytics</strong>
              <small>View your blog performance</small>
            </span>
          </button>

          <button 
            onClick={() => router.push('/adminpacha/dashboard/seo')}
            className="action-btn-large seo"
          >
            <span className="action-icon">🔍</span>
            <span className="action-text">
              <strong>SEO Tools</strong>
              <small>Optimize for search engines</small>
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced styles with new published posts section */}
      <style jsx>{`
        .dashboard-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          margin-bottom: 3rem;
        }

        .welcome-section h1 {
          color: #bd93f9;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .welcome-section p {
          color: #6272a4;
          font-size: 1.2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .user-info {
          display: flex;
          justify-content: center;
        }

        .user-card {
          background: linear-gradient(135deg, rgba(189, 147, 249, 0.1) 0%, rgba(139, 233, 253, 0.1) 100%);
          border: 1px solid rgba(189, 147, 249, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 400px;
        }

        .user-card h3 {
          color: #bd93f9;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .user-card p {
          color: #f8f8f2;
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .stats-section, .actions-section, .drafts-section, .published-section {
          margin-bottom: 3rem;
        }

        .stats-section h2, .actions-section h2 {
          color: #50fa7b;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .drafts-section h2 {
          color: #ffb86c;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .published-section h2 {
          color: #50fa7b;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .new-post-btn, .view-all-btn-header {
          background: linear-gradient(135deg, #50fa7b 0%, #8be9fd 100%);
          color: #282a36;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .new-post-btn:hover, .view-all-btn-header:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(80, 250, 123, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #1e1f29 0%, #282a36 100%);
          border: 2px solid #44475a;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .stat-card.total { border-color: #bd93f9; }
        .stat-card.published { border-color: #50fa7b; }
        .stat-card.draft { border-color: #ffb86c; }
        .stat-card.views { border-color: #8be9fd; }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #f8f8f2;
        }

        .stat-label {
          color: #6272a4;
          font-size: 0.9rem;
        }

        .posts-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem;
          color: #6272a4;
        }

        .loading-spinner-small {
          width: 24px;
          height: 24px;
          border: 3px solid #44475a;
          border-top: 3px solid #bd93f9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .no-posts {
          text-align: center;
          padding: 3rem;
          background: linear-gradient(135deg, rgba(255, 184, 108, 0.1) 0%, rgba(255, 184, 108, 0.05) 100%);
          border: 2px dashed rgba(255, 184, 108, 0.3);
          border-radius: 12px;
        }

        .no-posts-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-posts h3 {
          color: #ffb86c;
          margin-bottom: 0.5rem;
        }

        .no-posts p {
          color: #6272a4;
          margin-bottom: 2rem;
        }

        .create-first-post-btn {
          background: linear-gradient(135deg, #ffb86c 0%, #ff79c6 100%);
          color: #282a36;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .create-first-post-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 184, 108, 0.3);
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
          transition: all 0.3s ease;
        }

        .post-card.draft:hover {
          transform: translateY(-3px);
          border-color: #ffb86c;
          box-shadow: 0 8px 20px rgba(255, 184, 108, 0.2);
        }

        .post-card.published:hover {
          transform: translateY(-3px);
          border-color: #50fa7b;
          box-shadow: 0 8px 20px rgba(80, 250, 123, 0.2);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .post-title {
          color: #f8f8f2;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          margin-right: 1rem;
          line-height: 1.3;
        }

        .post-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .post-date {
          color: #6272a4;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid;
        }

        .status-badge.draft {
          background: rgba(255, 184, 108, 0.2);
          color: #ffb86c;
          border-color: rgba(255, 184, 108, 0.3);
        }

        .status-badge.published {
          background: rgba(80, 250, 123, 0.2);
          color: #50fa7b;
          border-color: rgba(80, 250, 123, 0.3);
        }

        .post-content {
          margin-bottom: 1rem;
        }

        .post-preview {
          color: #f8f8f2;
          line-height: 1.5;
          margin-bottom: 1rem;
          font-size: 0.9rem;
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
          font-size: 0.75rem;
          border: 1px solid rgba(189, 147, 249, 0.3);
        }

        .tag-more {
          background: rgba(98, 114, 164, 0.2);
          color: #6272a4;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          border: 1px solid rgba(98, 114, 164, 0.3);
        }

        .post-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          color: #6272a4;
        }

        .post-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.8rem;
        }

        .action-btn.edit {
          background: #8be9fd;
          color: #282a36;
        }

        .action-btn.view {
          background: #50fa7b;
          color: #282a36;
        }

        .action-btn.publish {
          background: #50fa7b;
          color: #282a36;
        }

        .action-btn.unpublish {
          background: #ffb86c;
          color: #282a36;
        }

        .action-btn.delete {
          background: #ff5555;
          color: #f8f8f2;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .view-all-drafts, .view-all-published {
          text-align: center;
          margin-top: 2rem;
        }

        .view-all-btn {
          background: linear-gradient(135deg, #6272a4 0%, #44475a 100%);
          color: #f8f8f2;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(98, 114, 164, 0.3);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .action-btn-large {
          background: linear-gradient(135deg, #1e1f29 0%, #282a36 100%);
          border: 2px solid #44475a;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-btn-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .action-btn-large.create:hover { border-color: #50fa7b; box-shadow: 0 8px 20px rgba(80, 250, 123, 0.3); }
        .action-btn-large.manage:hover { border-color: #8be9fd; box-shadow: 0 8px 20px rgba(139, 233, 253, 0.3); }
        .action-btn-large.analytics:hover { border-color: #ffb86c; box-shadow: 0 8px 20px rgba(255, 184, 108, 0.3); }
        .action-btn-large.seo:hover { border-color: #bd93f9; box-shadow: 0 8px 20px rgba(189, 147, 249, 0.3); }

        .action-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .action-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .action-text strong {
          color: #f8f8f2;
          font-size: 1.1rem;
        }

        .action-text small {
          color: #6272a4;
          font-size: 0.9rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 1rem;
          }

          .welcome-section h1 {
            font-size: 2rem;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .stats-grid, .actions-grid, .posts-grid {
            grid-template-columns: 1fr;
          }

          .post-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .post-status {
            align-items: flex-start;
          }

          .post-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;