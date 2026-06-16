import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  // Static routes
  const routes = ['', 'blog', 'projects', 'tags', 'about'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  // Try to load blog posts - contentlayer may not be ready during build
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { allBlogs } = require('contentlayer/generated')
    const blogRoutes = allBlogs
      .filter((post: any) => !post.draft)
      .map((post: any) => ({
        url: `${siteUrl}/${post.path}`,
        lastModified: post.lastmod || post.date,
      }))
    return [...routes, ...blogRoutes]
  } catch {
    return routes
  }
}
