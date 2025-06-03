"use client";
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    topPosts: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get post counts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status, views_count, created_at');

      const totalPosts = posts?.length || 0;
      const publishedPosts = posts?.filter(p => p.status === 'published').length || 0;
      const draftPosts = posts?.filter(p => p.status === 'draft').length || 0;
      const totalViews = posts?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0;

      // Get top posts by views
      const topPosts = posts
        ?.filter(p => p.status === 'published')
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 5) || [];

      setAnalytics({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        topPosts,
        recentActivity: posts?.slice(0, 10) || [],
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">📊 Loading analytics...</div>;
  }

  return (
    <div className="analytics-page">
      <h1>📈 Blog Analytics</h1>
      
      <div className="stats-grid">
        <StatCard 
          title="Total Posts" 
          value={analytics.totalPosts} 
          icon="📝" 
          color="#bd93f9"
        />
        <StatCard 
          title="Published" 
          value={analytics.publishedPosts} 
          icon="🚀" 
          color="#50fa7b"
        />
        <StatCard 
          title="Drafts" 
          value={analytics.draftPosts} 
          icon="✏️" 
          color="#ffb86c"
        />
        <StatCard 
          title="Total Views" 
          value={analytics.totalViews} 
          icon="👁️" 
          color="#8be9fd"
        />
      </div>

      <div className="analytics-grid">
        <div className="top-posts">
          <h3>🏆 Top Performing Posts</h3>
          {analytics.topPosts.map((post, index) => (
            <div key={post.id} className="post-item">
              <span className="rank">#{index + 1}</span>
              <div className="post-info">
                <h4>{post.title}</h4>
                <span className="views">{post.views_count || 0} views</span>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-activity">
          <h3>🕒 Recent Activity</h3>
          {analytics.recentActivity.map(post => (
            <div key={post.id} className="activity-item">
              <div className="activity-info">
                <h4>{post.title}</h4>
                <span className="status">{post.status}</span>
              </div>
              <span className="date">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .analytics-page h1 {
          color: #bd93f9;
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .top-posts, .recent-activity {
          background: rgba(68, 71, 90, 0.3);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #44475a;
        }

        .top-posts h3, .recent-activity h3 {
          margin: 0 0 1.5rem 0;
          color: #f8f8f2;
          font-size: 1.3rem;
        }

        .post-item, .activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(40, 42, 54, 0.5);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .post-item {
          gap: 1rem;
        }

        .rank {
          background: #bd93f9;
          color: #282a36;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .post-info, .activity-info {
          flex: 1;
        }

        .post-info h4, .activity-info h4 {
          margin: 0;
          color: #f8f8f2;
          font-size: 1rem;
        }

        .views, .status, .date {
          font-size: 0.9rem;
          color: #6272a4;
        }

        .status {
          background: ${post => post.status === 'published' ? '#50fa7b' : '#ffb86c'};
          color: #282a36;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #6272a4;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span className="stat-icon">{icon}</span>
      <h3>{title}</h3>
    </div>
    <div className="stat-value">{value}</div>
    <style jsx>{`
      .stat-card {
        background: linear-gradient(135deg, rgba(68, 71, 90, 0.8) 0%, rgba(40, 42, 54, 0.8) 100%);
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid ${color};
        transition: transform 0.2s ease;
      }

      .stat-card:hover {
        transform: translateY(-4px);
      }

      .stat-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .stat-icon {
        font-size: 1.5rem;
      }

      .stat-header h3 {
        margin: 0;
        color: #f8f8f2;
        font-size: 1.1rem;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: ${color};
      }
    `}</style>
  </div>
);