import type { MetadataRoute } from 'next';
import { BLOG_ARTICLES, DENTAL_SERVICES, DOCTORS } from '@/lib/clinic-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const now = new Date();

  const staticRoutes = [
    '/',
    '/about',
    '/services',
    '/offers',
    '/doctors',
    '/gallery',
    '/technology',
    '/testimonials',
    '/faqs',
    '/blog',
    '/appointment',
    '/contact',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.8,
  }));

  const serviceRoutes = DENTAL_SERVICES.map((srv) => ({
    url: `${baseUrl}/services/${srv.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const doctorRoutes = DOCTORS.map((doc) => ({
    url: `${baseUrl}/doctors/${doc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogRoutes = BLOG_ARTICLES.map((art) => ({
    url: `${baseUrl}/blog/${art.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...doctorRoutes, ...blogRoutes];
}
