import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from '@/app/seo'
import BlogListClient from './BlogListClient'

const POSTS_PER_PAGE = 6

export const metadata = genPageMetadata({ title: '博客' })

export default async function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)

  return (
    <BlogListClient
      allPosts={posts}
      initialDisplayPosts={initialDisplayPosts}
      currentPage={pageNumber}
      totalPages={totalPages}
    />
  )
}
