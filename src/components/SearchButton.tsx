'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  title: string
  summary: string
  tags: string
  slug: string
  type: string
}

const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchData, setSearchData] = useState<SearchResult[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load search index
  useEffect(() => {
    fetch('/search.json')
      .then((res) => res.json())
      .then((data) => setSearchData(data))
      .catch(() => {})
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
      setActiveIndex(0)
    }
  }, [isOpen])

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      setActiveIndex(0)
      if (!value.trim() || !searchData.length) {
        setResults([])
        return
      }
      const q = value.toLowerCase()
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tags.toLowerCase().includes(q)
      )
      setResults(filtered.slice(0, 8))
    },
    [searchData]
  )

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }
      if (!isOpen) return

      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % results.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
        return
      }
      if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelect(results[activeIndex].slug)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, results, activeIndex])

  const handleSelect = (slug: string) => {
    setIsOpen(false)
    router.push(`/${slug}`)
  }

  return (
    <>
      <button
        aria-label="Search"
        className="sm:block hidden"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="hover:text-primary-500 dark:hover:text-primary-400 h-6 w-6 text-gray-900 dark:text-gray-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Search panel */}
          <div className="relative z-50 w-full max-w-lg rounded-xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
            {/* Input */}
            <div className="flex items-center border-b border-gray-200 px-4 dark:border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="搜索文章..."
                className="w-full border-0 bg-transparent px-3 py-4 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-gray-100"
              />
              <kbd className="hidden rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400 sm:block dark:border-gray-600">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
              {query && results.length === 0 && searchData.length > 0 && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">
                  没有找到相关文章
                </p>
              )}
              {!query && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">
                  输入关键词搜索文章
                </p>
              )}
              {results.map((item, index) => (
                <button
                  key={item.slug}
                  onClick={() => handleSelect(item.slug)}
                  className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                    index === activeIndex
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                    {item.summary}
                  </div>
                  {item.tags && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.tags.split(',').map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>
                  <kbd className="rounded border border-gray-200 px-1 py-0.5 dark:border-gray-600">
                    ↑↓
                  </kbd>{' '}
                  导航
                </span>
                <span>
                  <kbd className="rounded border border-gray-200 px-1 py-0.5 dark:border-gray-600">
                    Enter
                  </kbd>{' '}
                  选择
                </span>
              </div>
              <span className="text-xs text-gray-400">
                <kbd className="rounded border border-gray-200 px-1 py-0.5 dark:border-gray-600">
                  ⌘K
                </kbd>{' '}
                打开
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchButton
