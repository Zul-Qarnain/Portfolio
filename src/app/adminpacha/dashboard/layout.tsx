"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { 
  LayoutDashboard, 
  FileText, 
  Edit, 
  PlusCircle, 
  BarChart2, 
  Search, 
  LogOut,
  User as UserIcon
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminHeaderProps {
  user: User | null;
}

const AdminSidebar = () => (
  <aside className="fixed left-0 top-0 h-full w-64 bg-[#1e1e2e] border-r border-[#44475a] flex flex-col z-50 shadow-xl">
    <div className="p-6 border-b border-[#44475a] flex items-center gap-3 bg-[#1e1e2e]">
      <div className="w-8 h-8 bg-gradient-to-br from-[#ff79c6] to-[#bd93f9] rounded-lg flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
        🧛‍♂️
      </div>
      <h2 className="text-xl font-bold text-[#f8f8f2] tracking-tight font-headline">Admin Portal</h2>
    </div>
    
    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#44475a] scrollbar-track-transparent">
      <Link href="/adminpacha/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#bd93f9]/30">
        <LayoutDashboard className="w-5 h-5 text-[#bd93f9] group-hover:text-[#ff79c6] transition-colors" />
        <span className="font-medium">Dashboard</span>
      </Link>
      
      <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-[#6272a4] uppercase tracking-widest">
        Content Management
      </div>
      
      <Link href="/posts" target="_blank" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#8be9fd]/30">
        <FileText className="w-5 h-5 text-[#8be9fd] group-hover:text-[#ff79c6] transition-colors" />
        <span className="font-medium">View Live Blog</span>
      </Link>
      
      <Link href="/adminpacha/dashboard/posts" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#50fa7b]/30">
        <Edit className="w-5 h-5 text-[#50fa7b] group-hover:text-[#ff79c6] transition-colors" />
        <span className="font-medium">Manage Posts</span>
      </Link>
      
      <Link href="/adminpacha/dashboard/posts/new" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#ff79c6]/30">
        <PlusCircle className="w-5 h-5 text-[#ff79c6] group-hover:text-[#bd93f9] transition-colors" />
        <span className="font-medium">New Post</span>
      </Link>

      <Link href="/adminpacha/dashboard/messages" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#ffb86c]/30">
        <div className="relative">
          <FileText className="w-5 h-5 text-[#ffb86c] group-hover:text-[#ff79c6] transition-colors" />
          {/* You could add a badge here if you fetch unread count */}
        </div>
        <span className="font-medium">Messages</span>
      </Link>
      
      <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-[#6272a4] uppercase tracking-widest">
        Insights & Tools
      </div>
      
      <Link href="/adminpacha/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#ffb86c]/30">
        <BarChart2 className="w-5 h-5 text-[#ffb86c] group-hover:text-[#ff79c6] transition-colors" />
        <span className="font-medium">Analytics</span>
      </Link>
      
      <Link href="/adminpacha/dashboard/seo" className="flex items-center gap-3 px-4 py-3 text-[#f8f8f2] hover:bg-[#44475a]/50 rounded-lg transition-all group border border-transparent hover:border-[#ff5555]/30">
        <Search className="w-5 h-5 text-[#ff5555] group-hover:text-[#ff79c6] transition-colors" />
        <span className="font-medium">SEO Tools</span>
      </Link>
    </nav>
    
    <div className="p-4 border-t border-[#44475a] bg-[#1e1e2e]">
      <div className="text-[10px] text-[#6272a4] text-center font-mono">
        v1.0.0 • Dracula Theme
      </div>
    </div>
  </aside>
);

const AdminHeader = ({ user }: AdminHeaderProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/adminpacha");
  };

  return (
    <header className="h-20 bg-[#1e1e2e]/95 backdrop-blur-sm border-b border-[#44475a] flex items-center justify-between px-8 sticky top-0 z-40 shadow-lg">
      <div>
        <h1 className="text-xl font-bold text-[#f8f8f2] font-headline tracking-tight">
          Blog Administration
        </h1>
        <p className="text-xs text-[#6272a4] mt-1">Manage your content and settings</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-[#282a36] rounded-full border border-[#44475a] shadow-sm">
          <div className="w-8 h-8 bg-gradient-to-br from-[#bd93f9] to-[#ff79c6] rounded-full flex items-center justify-center shadow-md">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#6272a4] font-semibold uppercase">Logged in as</span>
            <span className="text-sm text-[#f8f8f2] font-medium">{user?.email}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ff5555]/10 hover:bg-[#ff5555]/20 text-[#ff5555] rounded-xl transition-all duration-200 text-sm font-bold border border-[#ff5555]/20 hover:border-[#ff5555]/50 hover:shadow-[0_0_15px_rgba(255,85,85,0.3)]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (!session) router.push("/adminpacha");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282a36] flex flex-col items-center justify-center text-[#f8f8f2]">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#44475a] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-[#bd93f9] rounded-full animate-spin"></div>
        </div>
        <p className="text-[#bd93f9] font-medium animate-pulse tracking-wide">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282a36] text-[#f8f8f2] font-sans">
      <AdminSidebar />
      <div className="pl-64 flex flex-col min-h-screen transition-all duration-300">
        <AdminHeader user={user} />
        <main className="flex-1 p-8 overflow-y-auto bg-[#282a36]">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
