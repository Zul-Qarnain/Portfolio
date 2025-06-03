export interface BlogPost {
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
    tags: string[]; // Explicitly typed as string array
  }
  
  export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
  }
  
  export interface PostAnalytics {
    id: string;
    post_id: string;
    date: string;
    views: number;
    unique_views: number;
    bounce_rate?: number;
    avg_time_on_page?: number;
    referrer_source?: string;
  }