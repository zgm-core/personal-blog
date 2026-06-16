import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <div className="py-6">
      <h1 className="mb-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 animate-fade-in-up">
        关于我
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 作者信息卡片 */}
        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 lg:w-56 lg:flex-shrink-0 dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={120}
              height={120}
              className="h-24 w-24 rounded-full border-2 border-gray-100 dark:border-gray-800"
            />
          )}
          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{occupation}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{company}</p>
          <div className="mt-4 flex gap-2">
            <SocialIcon kind="mail" href={`mailto:${email}`} />
            <SocialIcon kind="github" href={github} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="x" href={twitter} />
            <SocialIcon kind="bluesky" href={bluesky} />
          </div>
        </div>

        {/* 正文区域 */}
        <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
