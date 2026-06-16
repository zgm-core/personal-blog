'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from '@/utils/formatDate'
import CategoryNav from '@/components/CategoryNav'
import PostCardStats from '@/components/PostCardStats'
import ReadButton from '@/components/ReadButton'
import tagData from '@/app/tag-data.json'
import type { Blog } from 'contentlayer/generated'

const MAX_DISPLAY = 6

const accentGradients = [
  'from-emerald-400 to-teal-500',
  'from-accent-400 to-primary-400',
  'from-violet-400 to-fuchsia-400',
  'from-amber-400 to-orange-400',
  'from-sky-400 to-indigo-400',
  'from-rose-400 to-pink-400',
]

function matchPost(post: Blog, query: string) {
  return (post.title || '').toLowerCase().includes(query.toLowerCase())
}

// 统计文章涉及的分类
function countCategory(categoryName: string, posts: Blog[]): number {
  const categoryTags = categoryGroups.find((g) => g.name === categoryName)?.tags ?? []
  if (categoryTags.length === 0) return 0
  return posts.filter((p) => p.tags?.some((t: string) => categoryTags.includes(t))).length
}

const categoryGroups = [
  { name: '前端技术', icon: '⚛️', tags: ['javascript', '前端'] },
  { name: '计算机网络', icon: '🌐', tags: ['HTTP', '计算机网络', 'Cookie', 'JWT', 'CORS', '跨域', '认证', '安全', '缓存', '浏览器'] },
  { name: '计算机基础', icon: '💻', tags: ['计算机基础', '二进制', '整数', '浮点数', '十进制', '进制转换', '十六进制', '八进制', '原码反码补码', 'CPU', '操作系统', 'x86', 'x64', '内存', 'Linux'] },
  { name: '项目实战', icon: '🗺️', tags: ['Three.js', '项目实战', '数据可视化'] },
]

export default function Home({ posts }: { posts: Blog[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return posts
    return posts.filter((p) => matchPost(p, query))
  }, [query, posts])

  const displayPosts = query.trim() ? filtered : filtered.slice(0, MAX_DISPLAY)

  const tagCount = Object.keys(tagData).length

  return (
    <div className="py-6">
      {/* Hero 区域 —— 个人品牌门户 */}
      <section className="animate-fade-in-up mb-12">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm dark:border-gray-800/60 dark:bg-gray-900">
          {/* 背景装饰 */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 blur-3xl dark:from-cyan-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-tr from-emerald-400/10 to-teal-400/10 blur-2xl dark:from-emerald-400/5 dark:to-teal-400/5" />

          <div className="relative">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              👋 你好，我是 <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">墨痕</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              一名热爱技术的前端开发者，这里记录学习过程中的思考与总结。专注于 JavaScript、计算机网络与计算机基础。
            </p>
          </div>

          {/* 数据概览 */}
          <div className="relative mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-cyan-50 px-4 py-2.5 dark:bg-cyan-950/40">
              <span className="text-lg">📝</span>
              <div>
                <div className="text-lg font-bold tabular-nums text-cyan-600 dark:text-cyan-400">{posts.length}</div>
                <div className="text-[10px] text-cyan-500/70 dark:text-cyan-400/60">篇文章</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2.5 dark:bg-purple-950/40">
              <span className="text-lg">🏷️</span>
              <div>
                <div className="text-lg font-bold tabular-nums text-purple-600 dark:text-purple-400">{tagCount}</div>
                <div className="text-[10px] text-purple-500/70 dark:text-purple-400/60">个标签</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 dark:bg-emerald-950/40">
              <span className="text-lg">📂</span>
              <div>
                <div className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{categoryGroups.length}</div>
                <div className="text-[10px] text-emerald-500/70 dark:text-emerald-400/60">个分类</div>
              </div>
            </div>
          </div>

          {/* 分类快捷入口 */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {categoryGroups.map((cat) => {
              const href = cat.name === '项目实战' ? '/projects/threejs' : `/tags/${cat.tags[0]}`
              const count = cat.name === '项目实战' ? 25 : countCategory(cat.name, posts)
              const label = cat.name === '项目实战' ? '个Demo' : '篇'
              return (
                <Link
                  key={cat.name}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="tabular-nums text-[10px] text-gray-300 dark:text-gray-600">{count}{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 最新文章标题 */}
      <div className="animate-fade-in-up mb-6">
        <div className="flex items-center gap-3">
          <span className="terminal-dot terminal-dot-green animate-terminal-blink" />
          <h2 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-200">
            最新文章
          </h2>
        </div>
      </div>

      {/* 搜索 */}
      <CategoryNav
        postCount={query.trim() ? filtered.length : posts.length}
        query={query}
        onQueryChange={setQuery}
      />

      {!displayPosts.length ? (
        <div className="animate-fade-in py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200/60 bg-accent-50/50 px-5 py-2.5 text-xs text-accent-600 dark:border-accent-800/60 dark:bg-accent-950/40 dark:text-accent-400">
            <span className="terminal-dot terminal-dot-yellow" />
            {query.trim() ? '无匹配结果' : 'NO DATA'}
          </span>
        </div>
      ) : (
        <>
          {/* 卡片网格 */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {displayPosts.map((post, idx) => {
              const { slug: postSlug, date, title, summary, tags } = post
              const gradient = accentGradients[idx % accentGradients.length]
              return (
                <Link
                  key={postSlug}
                  href={`/blog/${postSlug}`}
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

                    {/* 底部：标签 + 阅读按钮 */}
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

                      <ReadButton gradient={gradient} />
                    </div>

                    {/* 点赞 & 访问 */}
                    <PostCardStats slug={postSlug} compact />
                  </div>
                </Link>
              )
            })}
          </div>

          {!query.trim() && filtered.length > MAX_DISPLAY && (
            <div className="animate-fade-in-up mt-8 flex justify-center" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all duration-300 hover:border-accent-300 hover:text-accent-600 hover:shadow-md hover:scale-105 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-accent-700 dark:hover:text-accent-400"
              >
                查看全部文章
                <svg className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
