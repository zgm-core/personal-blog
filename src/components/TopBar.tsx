'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import headerNavLinks from '@/data/headerNavLinks'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const segmentMap: Record<string, string> = {
  blog: '博客',
  tags: '标签',
  projects: '项目',
  about: '关于',
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === '/') return [{ label: '首页' }]

  const segments = pathname.split('/').filter(Boolean).map(decodeURIComponent)
  const crumbs: { label: string; href?: string }[] = [{ label: '首页', href: '/' }]

  let accumulated = ''
  for (const seg of segments) {
    if (/^\d+$/.test(seg) || seg === 'page') continue
    accumulated += `/${encodeURIComponent(seg)}`
    const label = segmentMap[seg] || seg
    crumbs.push({ label, href: accumulated })
  }

  if (crumbs.length === 1) {
    const last = segments[segments.length - 1]
    crumbs.push({ label: segmentMap[last] || last })
  }

  return crumbs
}

export default function TopBar() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <header className="relative flex h-12 flex-shrink-0 items-center justify-between border-b border-gray-200/60 bg-white/70 backdrop-blur-md px-4 dark:border-gray-800/60 dark:bg-gray-950/70 lg:px-6">
      {/* 底部流动渐变线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-accent-400, #22d3ee) 25%, var(--color-primary-400) 50%, var(--color-accent-400, #22d3ee) 75%, transparent)',
          backgroundSize: '300% 100%',
          animation: 'data-flow 8s linear infinite',
        }}
      />

      {/* 左侧：面包屑 */}
      <div className="flex items-center gap-2 text-[13px] text-gray-400 dark:text-gray-500">
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="mx-1 text-gray-200 dark:text-gray-700">|</span>
        </div>
        <div className="flex items-center gap-1">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1" style={{ animationDelay: `${i * 0.06}s` }}>
              {i > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[13px] font-medium text-gray-400 transition-colors hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 右侧：导航 + 搜索 + 主题 */}
      <div className="flex items-center gap-0.5">
        <nav className="hidden items-center gap-0.5 sm:flex">
          {headerNavLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.title}
                href={link.href}
                className={`
                  relative rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-300
                  ${active
                    ? 'bg-accent-50/60 text-primary-600 dark:bg-accent-950/40 dark:text-primary-400'
                    : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                  }
                `}
              >
                {link.title}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-primary-400 dark:bg-primary-500" />
                )}
              </Link>
            )
          })}
        </nav>
        <div className="ml-1.5 flex items-center gap-0.5 border-l border-gray-200/60 pl-1.5 dark:border-gray-800/60">
          <SearchButton />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
