'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface TocHeading {
  depth: number
  value: string
  url: string
}

export default function Toc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)
  const [mounted, setMounted] = useState(false)
  const portalRef = useRef<HTMLElement | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const topHeadings = headings.filter((h) => h.depth === 2)

  useEffect(() => {
    portalRef.current = document.getElementById('toc-portal')
  }, [])

  useEffect(() => {
    if (topHeadings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    )

    topHeadings.forEach((h) => {
      const id = h.url?.replace('#', '')
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [topHeadings])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()
    const id = url.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }, [])

  if (topHeadings.length === 0 || !mounted) return null

  const content = (
    <nav className="w-56">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-3 flex w-full items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <svg className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        目录
      </button>

      {isExpanded && (
        <ul className="space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
          {topHeadings.map((h, idx) => {
            const id = h.url?.replace('#', '')
            const isActive = activeId === id
            return (
              <li key={h.url}>
                <a
                  href={h.url}
                  onClick={(e) => handleClick(e, h.url)}
                  className={`
                    block rounded-r-lg py-1.5 pl-3 pr-2 text-[12px] leading-snug transition-all duration-200
                    border-l-2 -ml-[13px]
                    ${isActive
                      ? 'border-primary-500 text-primary-600 font-medium bg-primary-50/60 dark:border-primary-400 dark:text-primary-400 dark:bg-primary-950/30'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <span className="mr-1 text-[10px] tabular-nums text-gray-300 dark:text-gray-600">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {h.value}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )

  if (!portalRef.current) return content

  return createPortal(content, portalRef.current)
}
