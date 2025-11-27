'use client';
import { useState } from 'react';

const SEOToolsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSitemapLoading, setIsSitemapLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePingSearchEngines = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seo/ping-google', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setMessage('✅ Search engines notified successfully!');
      } else {
        setMessage('❌ Failed to notify search engines');
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSitemap = async () => {
    setIsSitemapLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/sitemap/regenerate', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setMessage('✅ Sitemap updated successfully!');
      } else {
        setMessage('❌ Failed to update sitemap');
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message);
    } finally {
      setIsSitemapLoading(false);
    }
  };

  const handleViewSitemap = () => {
    window.open('/sitemap.xml', '_blank');
  };

  return (
    <div className="seo-tools-page">
      <div className="header-section">
        <h1>🔍 SEO Tools</h1>
        <p>Manage your site&apos;s search engine optimization</p>
      </div>

      <div className="tools-grid">
        <div className="tool-card">
          <h3>🗺️ Sitemap Management</h3>
          <p>View and manage your site&apos;s sitemap</p>
          <div className="tool-actions">
            <button 
              onClick={handleViewSitemap}
              className="btn btn-primary"
            >
              View Sitemap
            </button>
            <button 
              onClick={handleUpdateSitemap}
              disabled={isSitemapLoading}
              className="btn btn-secondary"
            >
              {isSitemapLoading ? '⏳ Updating...' : '🔄 Update Sitemap'}
            </button>
          </div>
        </div>

        <div className="tool-card">
          <h3>📡 Search Engine Ping</h3>
          <p>Notify Google and Bing about sitemap updates</p>
          <div className="tool-actions">
            <button 
              onClick={handlePingSearchEngines}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              {isLoading ? '⏳ Pinging...' : '📡 Ping Search Engines'}
            </button>
          </div>
        </div>

        <div className="tool-card">
          <h3>📊 SEO Status</h3>
          <p>Current SEO configuration status</p>
          <div className="status-list">
            <div className="status-item">
              ✅ Sitemap: Active
            </div>
            <div className="status-item">
              ✅ Meta Tags: Configured
            </div>
            <div className="status-item">
              ✅ Open Graph: Enabled
            </div>
          </div>
        </div>

        <div className="tool-card">
          <h3>🔗 Quick Links</h3>
          <p>Useful SEO resources and tools</p>
          <div className="tool-actions">
            <button 
              onClick={() => window.open('https://search.google.com/search-console?utm_source=about-page&resource_id=https://shihab.vercel.app/', '_blank')}
              className="btn btn-outline"
            >
              Google Search Console
            </button>
            <button 
              onClick={() => window.open('https://www.bing.com/webmasters/sitemaps?siteUrl=https://shihab.vercel.app/', '_blank')}
              className="btn btn-outline"
            >
              Bing Webmaster Tools
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <style jsx>{`
        .seo-tools-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-section {
          margin-bottom: 3rem;
          text-align: center;
        }

        .header-section h1 {
          color: #bd93f9;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .header-section p {
          color: #6272a4;
          font-size: 1.2rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .tool-card {
          background: #282a36;
          border: 1px solid #44475a;
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          border-color: #bd93f9;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(189, 147, 249, 0.15);
        }

        .tool-card h3 {
          color: #f8f8f2;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .tool-card p {
          color: #6272a4;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .tool-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #bd93f9;
          color: #282a36;
        }

        .btn-primary:hover:not(:disabled) {
          background: #a881f5;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #50fa7b;
          color: #282a36;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #45e06f;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #f8f8f2;
          border: 1px solid #44475a;
        }

        .btn-outline:hover {
          border-color: #bd93f9;
          background: rgba(189, 147, 249, 0.1);
        }

        .status-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .status-item {
          color: #50fa7b;
          font-size: 0.9rem;
        }

        .message {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 2rem;
          text-align: center;
          font-weight: 500;
        }

        .message.success {
          background: rgba(80, 250, 123, 0.1);
          color: #50fa7b;
          border: 1px solid #50fa7b;
        }

        .message.error {
          background: rgba(255, 85, 85, 0.1);
          color: #ff5555;
          border: 1px solid #ff5555;
        }

        @media (max-width: 768px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
          
          .seo-tools-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SEOToolsPage;