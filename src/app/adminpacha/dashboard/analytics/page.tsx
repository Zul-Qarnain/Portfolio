"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import {
  DEFAULT_RECENT_LIMIT,
  EMPTY_SITE_VISIT_STATS,
  RECENT_LIMIT_OPTIONS,
  VISIT_RETENTION_DAYS,
  fetchSiteVisitStats,
  type SiteVisitStats,
} from '@/lib/visits';

interface PostData {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  views_count: number;
  created_at: string;
}

interface AnalyticsData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  topPosts: PostData[];
  recentActivity: PostData[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    topPosts: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<SiteVisitStats>(EMPTY_SITE_VISIT_STATS);
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [visitsError, setVisitsError] = useState<string | null>(null);
  const [recentLimit, setRecentLimit] = useState<number>(DEFAULT_RECENT_LIMIT);
  const supabase = createClient();

  const loadVisits = async (limit: number) => {
    setVisitsLoading(true);
    setVisitsError(null);

    try {
      setVisits(await fetchSiteVisitStats(supabase, limit));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('[PGRST202]')) {
        // Expected until the migration is applied. The banner states it plainly,
        // so keep it out of console.error to avoid Next's dev error overlay.
        console.warn('Site visit tracking is not provisioned yet:', message);
        setVisitsError(
          'Visit tracking is not set up in this database yet. Run supabase/migrations/0001_site_visits.sql in the Supabase SQL editor, then refresh this page.'
        );
      } else if (/authentication required/i.test(message)) {
        console.warn('Site visit stats blocked by admin session:', message);
        setVisitsError('Your admin session expired — sign in again to load visit stats.');
      } else {
        console.error('Error fetching site visits:', message);
        setVisitsError(`Could not load site visits: ${message}`);
      }
    } finally {
      setVisitsLoading(false);
    }
  };

  useEffect(() => {
    loadVisits(recentLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentLimit]);

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

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <span className="status" style={{ background: post.status === 'published' ? '#50fa7b' : '#ffb86c' }}>{post.status}</span>
              </div>
              <span className="date">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="visits-section">
        <div className="section-head">
          <h2>🌐 Site Visits</h2>
          <p className="section-note">
            Unique visitors count each IP once per UTC day. Rows older than {VISIT_RETENTION_DAYS} days are pruned automatically.
          </p>
        </div>

        {visitsError && <p className="visits-error">⚠️ {visitsError}</p>}

        {visitsLoading ? (
          <p className="visits-loading">Loading visit stats...</p>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard
                title="Total Page Loads"
                value={visits.total_page_loads}
                icon="👁️"
                color="#8be9fd"
              />
              <StatCard
                title="Loads Today"
                value={visits.loads_today}
                icon="⚡"
                color="#ffb86c"
              />
              <StatCard
                title="Unique Today"
                value={visits.unique_visitors_today}
                icon="🧍"
                color="#50fa7b"
              />
              <StatCard
                title={`Unique ${VISIT_RETENTION_DAYS}d`}
                value={visits.unique_visitors_30d}
                icon="📅"
                color="#bd93f9"
              />
            </div>

            <div className="analytics-grid">
              <div className="top-posts">
                <h3>📄 Traffic by page</h3>
                {visits.by_path.length === 0 ? (
                  <p className="empty-row">No page traffic recorded yet.</p>
                ) : (
                  visits.by_path.map(entry => (
                    <div key={entry.path} className="visit-row">
                      <span className="visit-path" title={entry.path}>{entry.path}</span>
                      <span className="visit-metrics">
                        <span>{entry.loads} loads</span>
                        <span>{entry.unique_visitors} unique</span>
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="recent-activity">
                <div className="recent-head">
                  <h3>🕒 Recent visitors</h3>
                  <div className="limit-picker">
                    <span className="limit-label">Show</span>
                    {RECENT_LIMIT_OPTIONS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setRecentLimit(option)}
                        className={option === recentLimit ? 'limit-active' : undefined}
                        disabled={visitsLoading}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {visits.recent.length === 0 ? (
                  <p className="empty-row">No visitors recorded yet.</p>
                ) : (
                  visits.recent.map(visit => (
                    <div key={`${visit.visited_at}-${visit.ip}-${visit.path}`} className="visit-row">
                      <span className="visit-ip">{visit.ip}</span>
                      <span className="visit-path" title={visit.path}>{visit.path}</span>
                      <span className="visit-date">
                        {new Date(visit.visited_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </section>

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

        .visits-section {
          margin-top: 3rem;
        }

        .section-head {
          margin-bottom: 1.5rem;
        }

        .section-head h2 {
          margin: 0 0 0.25rem 0;
          color: #8be9fd;
          font-size: 1.8rem;
        }

        .section-note {
          margin: 0;
          color: #6272a4;
          font-size: 0.85rem;
        }

        .visits-error {
          background: rgba(255, 85, 85, 0.12);
          border: 1px solid rgba(255, 85, 85, 0.35);
          color: #ff5555;
          padding: 0.9rem 1.1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          margin: 0 0 1.5rem 0;
        }

        .visits-loading {
          color: #6272a4;
          font-size: 1.1rem;
        }

        .recent-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .recent-head h3 {
          margin: 0;
        }

        .limit-picker {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .limit-label {
          color: #6272a4;
          font-size: 0.8rem;
          margin-right: 0.25rem;
        }

        .limit-picker button {
          background: rgba(68, 71, 90, 0.5);
          border: 1px solid #44475a;
          color: #f8f8f2;
          border-radius: 6px;
          padding: 0.3rem 0.7rem;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .limit-picker button:hover:not(:disabled) {
          border-color: #bd93f9;
        }

        .limit-picker button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .limit-active {
          background: #bd93f9 !important;
          color: #282a36 !important;
          font-weight: 700;
          border-color: #bd93f9 !important;
        }

        .visit-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          background: rgba(40, 42, 54, 0.5);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .visit-path {
          flex: 1;
          min-width: 0;
          color: #f8f8f2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .visit-ip {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: #50fa7b;
          font-size: 0.82rem;
          flex-shrink: 0;
        }

        .visit-metrics {
          display: flex;
          gap: 0.9rem;
          color: #6272a4;
          font-size: 0.82rem;
          flex-shrink: 0;
        }

        .visit-date {
          color: #6272a4;
          font-size: 0.78rem;
          flex-shrink: 0;
        }

        .empty-row {
          color: #6272a4;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .visit-row {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
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