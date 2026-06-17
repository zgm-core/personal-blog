import { ReactNode } from 'react'
import { formatDate } from '@/utils/formatDate'
import { CoreContent } from '@/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Toc from '@/components/Toc'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostSimple({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, toc } = content

  return (
    <>
      <ScrollTopAndComment />
      <article className="py-8">
        <header className="space-y-3 border-b border-gray-200 pb-8 text-center dark:border-gray-800 animate-fade-in-up">
          <dl>
            <dt className="sr-only">发布于</dt>
            <dd className="text-sm text-gray-400 dark:text-gray-500">
              <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
            </dd>
          </dl>
          <PageTitle className="!text-gray-900 dark:!text-gray-100">{title}</PageTitle>
        </header>
        <div className="prose dark:prose-invert max-w-none py-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {children}
        </div>

        <Toc headings={toc as any} />
        {siteMetadata.comments && (
          <div className="border-t border-gray-200 pt-6 pb-6 text-center dark:border-gray-800" id="comment">
            <Comments slug={slug} />
          </div>
        )}
        <footer className="border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row sm:justify-between animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {prev && prev.path && (
              <Link
                href={`/${prev.path}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label={`上一篇: ${prev.title}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                {prev.title}
              </Link>
            )}
            {next && next.path && (
              <Link
                href={`/${next.path}`}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label={`下一篇: ${next.title}`}
              >
                {next.title}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
          <div className="mt-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href={`/${path.split('/')[0]}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="返回博客"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>
              返回博客
            </Link>
          </div>
        </footer>
      </article>
    </>
  )
}
