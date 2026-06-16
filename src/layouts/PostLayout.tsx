import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import Toc from '@/components/Toc'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import ArticleStatsWrapper from '@/components/ArticleStatsWrapper'

const editUrl = (path: string) => `${siteMetadata.siteRepo}/blob/main/data/${path}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc } = content

  return (
    <>
      <ScrollTopAndComment />
      <ArticleStatsWrapper slug={slug as string}>
        <article className="py-6">
          {/* 面包屑 + 编辑链接 */}
          <div className="mb-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 animate-fade-in-up">
            <Link href={`/${path.split('/')[0]}`} className="inline-flex items-center gap-1 transition-colors hover:text-primary-500 dark:hover:text-primary-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
              返回列表
            </Link>
            <Link href={editUrl(filePath)} className="transition-colors hover:text-primary-500 dark:hover:text-primary-400">
              编辑
            </Link>
          </div>

          {/* 文章头部 */}
          <header className="mb-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
              {authorDetails.map((author) => (
                <span key={author.name} className="inline-flex items-center gap-1.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      width={18}
                      height={18}
                      alt="avatar"
                      className="h-4.5 w-4.5 rounded-full"
                    />
                  )}
                  {author.name}
                </span>
              ))}
              {tags && tags.length > 0 && (
                <>
                  <span className="block h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* 正文 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="prose dark:prose-invert max-w-none">
              {children}
            </div>
          </div>

          <Toc headings={toc as any} />

          {/* 上一篇 / 下一篇 */}
          {(next || prev) && (
            <div className="mt-4 grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {prev?.path ? (
                <Link href={`/${prev.path}`} className="group rounded-lg border border-gray-200 bg-white p-4 text-sm transition-all duration-200 hover:border-primary-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700">
                  <span className="mb-1 block text-xs font-medium text-gray-400 dark:text-gray-500">← 上一篇</span>
                  <span className="font-medium text-gray-700 transition-colors group-hover:text-primary-500 dark:text-gray-300 dark:group-hover:text-primary-400 line-clamp-1">{prev.title}</span>
                </Link>
              ) : <div />}
              {next?.path ? (
                <Link href={`/${next.path}`} className="group rounded-lg border border-gray-200 bg-white p-4 text-right text-sm transition-all duration-200 hover:border-primary-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700">
                  <span className="mb-1 block text-xs font-medium text-gray-400 dark:text-gray-500">下一篇 →</span>
                  <span className="font-medium text-gray-700 transition-colors group-hover:text-primary-500 dark:text-gray-300 dark:group-hover:text-primary-400 line-clamp-1">{next.title}</span>
                </Link>
              ) : <div />}
            </div>
          )}

          {/* 评论 */}
          {siteMetadata.comments && (
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }} id="comment">
              <Comments slug={slug} />
            </div>
          )}
        </article>
      </ArticleStatsWrapper>
    </>
  )
}
