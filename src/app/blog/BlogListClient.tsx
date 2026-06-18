'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import CategoryNav from '@/components/CategoryNav'
import ReadButton from '@/components/ReadButton'
import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/utils/contentlayer'

interface Props {
  allPosts: CoreContent<Blog>[]
  initialDisplayPosts: CoreContent<Blog>[]
  currentPage: number
  totalPages: number
}

const accentGradients = [
  'from-emerald-400 to-teal-500',
  'from-accent-400 to-primary-400',
  'from-violet-400 to-fuchsia-400',
  'from-amber-400 to-orange-400',
  'from-sky-400 to-indigo-400',
  'from-rose-400 to-pink-400',
]

function matchPost(post: CoreContent<Blog>, query: string) {
  return (post.title || '').toLowerCase().includes(query.toLowerCase())
}

export default function BlogListClient({ allPosts, initialDisplayPosts, currentPage, totalPages }: Props) {
  const [query, setQuery] = useState('')

  const displayPosts = useMemo(() => {
    if (!query.trim()) return initialDisplayPosts
    return allPosts.filter((p) => matchPost(p, query))
  }, [query, allPosts, initialDisplayPosts])

  return (
    <div className="py-6">
      {/* 标题 */}
      <div className="mb-8 flex items-center gap-3">
        <span className="terminal-dot terminal-dot-green animate-terminal-blink" />
        <h1 className="animate-fade-in-up text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-200">
          全部文章
        </h1>
        <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs tabular-nums text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          {allPosts.length} 篇
        </span>
      </div>

      {/* 搜索 */}
      <CategoryNav
        postCount={query.trim() ? displayPosts.length : allPosts.length}
        query={query}
        onQueryChange={setQuery}
      />

      {/* 列表布局 */}
      {displayPosts.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {displayPosts.map((post, idx) => {
            const { slug, date, title, summary, tags } = post
            const gradient = accentGradients[idx % accentGradients.length]
            return (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="animate-fade-in-up group flex items-center gap-5 py-5 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50 -mx-3 px-3 rounded-lg first:pt-0"
                style={{ animationDelay: `${0.03 + idx * 0.04}s` }}
              >
                {/* 左侧日期 */}
                <time
                  dateTime={date}
                  className="shrink-0 text-[12px] tabular-nums leading-relaxed text-gray-400 dark:text-gray-500"
                  suppressHydrationWarning
                >
                  {formatDate(date, siteMetadata.locale)}
                </time>

                {/* 右侧内容 */}
                <div className="min-w-0 flex-1">
                  {/* 标题 */}
                  <h2 className="text-[15px] font-semibold leading-snug text-gray-800 transition-colors group-hover:text-accent-600 dark:text-gray-100 dark:group-hover:text-accent-400">
                    {title}
                  </h2>

                  {/* 摘要 */}
                  {summary && (
                    <p className="mt-1.5 text-[13px] leading-relaxed text-gray-400 line-clamp-2 dark:text-gray-500">
                      {summary}
                    </p>
                  )}

                  {/* 标签 */}
                  {tags && tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-gray-150 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-400 transition-colors group-hover:border-accent-200/80 group-hover:text-accent-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:group-hover:border-accent-800/60 dark:group-hover:text-accent-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {tags.length > 4 && (
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">+{tags.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* 阅读按钮 */}
                <ReadButton gradient={gradient} />
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="animate-fade-in py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200/60 bg-accent-50/50 px-5 py-2.5 text-xs text-accent-600 dark:border-accent-800/60 dark:bg-accent-950/40 dark:text-accent-400">
            <span className="terminal-dot terminal-dot-yellow" />
            无匹配结果
          </span>
        </div>
      )}

      {/* 分页 */}
      {!query.trim() && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
          {currentPage > 1 ? (
            <Link
              href={currentPage - 1 === 1 ? '/blog/' : `/blog/page/${currentPage - 1}`}
              className="inline-flex items-center gap-1.5 rounded px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-accent-50 hover:text-accent-600 dark:text-gray-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              上一页
            </Link>
          ) : (
            <span />
          )}
          <span className="rounded-lg bg-accent-50 px-4 py-1.5 text-sm tabular-nums text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={`/blog/page/${currentPage + 1}`}
              className="inline-flex items-center gap-1.5 rounded px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-accent-50 hover:text-accent-600 dark:text-gray-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
            >
              下一页
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  )
}
