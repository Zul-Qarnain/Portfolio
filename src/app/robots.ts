import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/adminpacha/',
            }
        ],
        sitemap: 'https://shihab.vercel.app/sitemap.xml',
        host: 'https://shihab.vercel.app',
    };
}
