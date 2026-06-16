import Link from 'next/link'
import tagData from '@/app/tag-data.json'
import { slug } from 'github-slugger'
import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({ title: '标签', description: '按标签浏览文章' })

export default function TagsPage() {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div className="py-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 animate-fade-in-up">
        标签
      </h1>
      <div className="flex flex-wrap gap-3">
        {sortedTags.map((tag, idx) => {
          const count = tagCounts[tag]
          return (
            <Link
              key={tag}
              href={`/tags/${slug(tag)}`}
              className="animate-fade-in-up group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:border-primary-200 hover:text-primary-600 hover:shadow dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-primary-800 dark:hover:text-primary-400"
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              <span className="transition-colors group-hover:text-primary-500">{tag}</span>
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs tabular-nums text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                {count}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
