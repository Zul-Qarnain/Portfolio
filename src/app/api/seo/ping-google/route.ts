import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shihab.vercel.app/';
    const sitemapUrl = `${siteUrl}sitemap.xml`;
    
    // Ping Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    try {
      const response = await fetch(googlePingUrl);
      console.log('Google ping response:', response.status);
    } catch (error) {
      console.warn('Failed to ping Google:', error);
    }

    // Ping Bing
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    try {
      const response = await fetch(bingPingUrl);
      console.log('Bing ping response:', response.status);
    } catch (error) {
      console.warn('Failed to ping Bing:', error);
    }

    return new NextResponse('Search engines notified', { status: 200 });
  } catch (error) {
    console.error('Error pinging search engines:', error);
    return new NextResponse('Error pinging search engines', { status: 500 });
  }
}