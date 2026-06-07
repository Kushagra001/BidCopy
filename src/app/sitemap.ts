import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bidcopy.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                               lastModified: new Date(), priority: 1.0 },
    { url: `${base}/upwork-proposal-generator`,     lastModified: new Date(), priority: 0.9 },
    { url: `${base}/freelancer-proposal-generator`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/contra-proposal-generator`,     lastModified: new Date(), priority: 0.9 },
    { url: `${base}/free-proposal-generator`,       lastModified: new Date(), priority: 0.9 },
    { url: `${base}/blog`,                          lastModified: new Date(), priority: 0.7 },
  ]

  return staticRoutes
}
