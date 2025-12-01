import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/', '/adminpacha/', '/.git/', '/node_modules/'],
        },
        sitemap: 'https://shihab.vercel.app/sitemap.xml',
    };
}
