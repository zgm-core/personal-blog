'use client'

import { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from '@/utils/formatDate'
import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/utils/contentlayer'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import CategoryNav from '@/components/CategoryNav'
import PostCardStats from '@/components/PostCardStats'
import ReadButton from '@/components/ReadButton'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage, compact }: PaginationProps & { compact?: boolean }) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  const linkClass = compact
    ? 'inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105'
    : 'inline-flex items-center gap-1.5 rounded px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105'

  return (
    <div className={compact ? 'flex items-center gap-2' : 'mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800'}>
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className={`${linkClass} text-gray-500 hover:bg-accent-50 hover:text-accent-600 dark:text-gray-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          {!compact && '上一页'}
        </Link>
      ) : (
        <button className={`${linkClass} cursor-default text-gray-300 dark:text-gray-600`} disabled>
          {!compact && '上一页'}
        </button>
      )}
      <span className={compact ? 'rounded bg-accent-50 px-2.5 py-1 text-xs tabular-nums text-accent-600 dark:bg-accent-950/40 dark:text-accent-400' : 'rounded-lg bg-accent-50 px-4 py-1.5 text-sm tabular-nums text-accent-600 dark:bg-accent-950/40 dark:text-accent-400'}>
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className={`${linkClass} text-gray-500 hover:bg-accent-50 hover:text-accent-600 dark:text-gray-400 dark:hover:bg-accent-950/40 dark:hover:text-accent-400`}
        >
          {!compact && '下一页'}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      ) : (
        <button className={`${linkClass} cursor-default text-gray-300 dark:text-gray-600`} disabled>
          {!compact && '下一页'}
        </button>
      )}
    </div>
  )
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

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const baseDisplay = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  const [query, setQuery] = useState('')

  const displayPosts = useMemo(() => {
    if (!query.trim()) return baseDisplay
    return baseDisplay.filter((p) => matchPost(p, query))
  }, [query, baseDisplay])

  return (
    <div className="py-6">
      {/* 标题行 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="terminal-dot terminal-dot-green animate-terminal-blink" />
          <h1 className="animate-fade-in-up text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-200">
            {title}
          </h1>
        </div>
        {!query.trim() && pagination && pagination.totalPages > 1 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} compact />
          </div>
        )}
      </div>

      {/* 搜索 */}
      <CategoryNav
        postCount={query.trim() ? displayPosts.length : baseDisplay.length}
        query={query}
        onQueryChange={setQuery}
      />

      {/* 卡片网格 */}
      {displayPosts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {displayPosts.map((post, idx) => {
            const { path, date, title, summary, tags, slug } = post
            const gradient = accentGradients[idx % accentGradients.length]
            return (
              <Link
                key={path}
                href={`/${path}`}
                className="animate-fade-in-up group relative isolate flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gray-200/40 dark:border-gray-800/60 dark:bg-gray-900 dark:hover:shadow-gray-950/60"
                style={{ animationDelay: `${0.06 + idx * 0.06}s` }}
              >
                {/* 顶部渐变条 */}
                <span className={`absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${gradient} opacity-60 transition-all duration-500 group-hover:h-[4px] group-hover:opacity-100`} />

                {/* Hover 发光背景 */}
                <span className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06]`} />

                {/* 角落装饰 - 左上 */}
                <svg className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-100 transition-colors duration-500 group-hover:text-accent-200 dark:text-gray-800 dark:group-hover:text-accent-800/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v5a2 2 0 0 0 2 2h5" />
                  <circle cx="5" cy="5" r="1" fill="currentColor" />
                </svg>

                {/* 角落装饰 - 右下 */}
                <svg className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 rotate-180 text-gray-100 transition-colors duration-500 group-hover:text-primary-200 dark:text-gray-800 dark:group-hover:text-primary-800/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v5a2 2 0 0 0 2 2h5" />
                  <circle cx="5" cy="5" r="1" fill="currentColor" />
                </svg>

                {/* 内容区 */}
                <div className="relative z-10 flex flex-1 flex-col">
                  {/* 日期行 */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${gradient} animate-neon-pulse-accent`} />
                    <time
                      dateTime={date}
                      className="text-[11px] tabular-nums text-gray-400 dark:text-gray-500"
                      suppressHydrationWarning
                    >
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </div>

                  {/* 标题 */}
                  <h2 className="text-[15px] font-bold leading-snug text-gray-800 transition-colors duration-300 group-hover:text-accent-600 dark:text-gray-100 dark:group-hover:text-accent-400 line-clamp-2">
                    {title}
                  </h2>

                  {/* 摘要 */}
                  <p className="mt-2 flex-1 text-[12px] leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 line-clamp-2">
                    {summary}
                  </p>

                  {/* 底部：标签 + 阅读箭头 */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {tags && tags.length > 0 ? (
                        <>
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full border border-gray-150 bg-gray-50 px-2.5 py-0.5 text-[10px] font-medium text-gray-500 transition-all duration-300 group-hover:border-accent-200/80 group-hover:bg-accent-50/80 group-hover:text-accent-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:border-accent-800/60 dark:group-hover:bg-accent-950/40 dark:group-hover:text-accent-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                              +{tags.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </div>

                    {/* 阅读按钮 */}
                    <ReadButton gradient={gradient} />
                  </div>

                  {/* 点赞 & 访问 */}
                  <PostCardStats slug={slug} compact />
                </div>
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

      {!query.trim() && pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
