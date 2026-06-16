'use client'

import { useRef } from 'react'

interface SearchBarProps {
  postCount: number
  query: string
  onQueryChange: (q: string) => void
}

export default function SearchBar({ postCount, query, onQueryChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0.02s' }}>
      <div className="relative">
        {/* 搜索图标 */}
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 transition-colors duration-300 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={`搜索 ${postCount} 篇文章...`}
          className="w-full rounded-xl border border-gray-200/80 bg-white py-3 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 shadow-sm outline-none transition-all duration-300 focus:border-accent-300 focus:shadow-md focus:ring-2 focus:ring-accent-100 dark:border-gray-800/60 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-accent-700 dark:focus:ring-accent-900/40"
        />

        {/* 清除按钮 */}
        {query && (
          <button
            onClick={() => {
              onQueryChange('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 搜索结果计数 */}
      {query.trim() && (
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
          匹配到 <span className="font-semibold text-accent-500">{postCount}</span> 篇文章
        </p>
      )}
    </div>
  )
}
