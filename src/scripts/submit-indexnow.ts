
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const API_KEY = '9f6c1fc962ee4cc8a182f31aafb11c69';
const HOST = 'shihab.vercel.app';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

async function getPostUrls(): Promise<string[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials not found in environment variables. Skipping dynamic posts.');
        return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('status', 'published');

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return posts?.map(post => `https://${HOST}/posts/${post.slug}`) || [];
}

async function main() {
    console.log('🚀 Starting IndexNow submission...');

    const staticRoutes = [
        `https://${HOST}/`,
        `https://${HOST}/posts`,
        `https://${HOST}/publications`,
        `https://${HOST}/projects`,
        `https://${HOST}/events`,
        `https://${HOST}/contact`,
    ];

    const postRoutes = await getPostUrls();
    const urlList = [...staticRoutes, ...postRoutes];

    console.log(`Found ${urlList.length} URLs to submit.`);

    const payload = {
        host: HOST,
        key: API_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urlList,
    };

    try {
        const response = await fetch('https://api.indexnow.org/IndexNow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 200 || response.status === 202) {
            console.log('✅ Successfully submitted URLs to IndexNow!');
        } else {
            console.error(`❌ Failed to submit. Status: ${response.status}`);
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('❌ Error submitting to IndexNow:', error);
    }
}

main();
