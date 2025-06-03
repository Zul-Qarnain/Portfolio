"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminHeaderProps {
  user: User | null;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Fix: Proper typing
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/adminpacha");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/adminpacha");
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <AdminHeader user={user} />
        <div className="admin-content">
          {children}
        </div>
      </main>
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #282a36;
          color: #f8f8f2;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .admin-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #282a36;
          color: #f8f8f2;
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

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <div className="sidebar-header">
      <h2>🧛‍♂️ Admin Portal</h2>
    </div>
    <nav className="sidebar-nav">
      <a href="/adminpacha/dashboard" className="nav-item">
        📊 Dashboard
      </a>
      <a href="/posts" className="nav-item" target="_blank" rel="noopener noreferrer">
        📝 Blog Posts
      </a>
      <a href="/adminpacha/dashboard/posts" className="nav-item">
        🛠️ Manage Posts
      </a>
      <a href="/adminpacha/dashboard/posts/new" className="nav-item">
        ➕ New Post
      </a>
      <a href="/adminpacha/dashboard/analytics" className="nav-item">
        📈 Analytics
      </a>
      <a href="/adminpacha/dashboard/seo" className="nav-item">
        🔍 SEO Tools
      </a>
    </nav>
    <style jsx>{`
      .admin-sidebar {
        width: 280px;
        background: linear-gradient(180deg, #1e1f29 0%, #282a36 100%);
        border-right: 2px solid #44475a;
        padding: 0;
      }
      .sidebar-header {
        padding: 2rem 1.5rem;
        border-bottom: 1px solid #44475a;
        background: rgba(189, 147, 249, 0.1);
      }
      .sidebar-header h2 {
        margin: 0;
        color: #bd93f9;
        font-size: 1.4rem;
        text-align: center;
      }
      .sidebar-nav {
        padding: 1rem 0;
      }
      .nav-item {
        display: block;
        padding: 1rem 1.5rem;
        color: #f8f8f2;
        text-decoration: none;
        border-left: 3px solid transparent;
        transition: all 0.2s ease;
      }
      .nav-item:hover {
        background: rgba(189, 147, 249, 0.1);
        border-left-color: #bd93f9;
        color: #bd93f9;
      }
    `}</style>
  </aside>
);

const AdminHeader = ({ user }: AdminHeaderProps) => { // Fix: Proper typing
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/adminpacha");
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <h1>Blog Administration</h1>
        <div className="header-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
      <style jsx>{`
        .admin-header {
          background: linear-gradient(135deg, #44475a 0%, #6272a4 100%);
          border-bottom: 2px solid #bd93f9;
          padding: 1rem 2rem;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-content h1 {
          margin: 0;
          color: #f8f8f2;
          font-size: 1.5rem;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-email {
          color: #8be9fd;
          font-size: 0.9rem;
        }
        .logout-btn {
          background: linear-gradient(135deg, #ff5555 0%, #ff79c6 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease;
        }
        .logout-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </header>
  );
};