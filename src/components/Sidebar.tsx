'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { slug } from 'github-slugger'
import tagData from '@/app/tag-data.json'
import siteMetadata from '@/data/siteMetadata'
import Logo from '@/components/Logo'
import SocialIcon from '@/components/social-icons'

const tagCounts = tagData as Record<string, number>

interface CategoryGroup {
  name: string
  icon: string
  tags: string[]
}

const categoryGroups: CategoryGroup[] = [
  {
    name: '前端技术',
    icon: '⚛️',
    tags: ['javascript', '前端'],
  },
  {
    name: '计算机网络',
    icon: '🌐',
    tags: ['HTTP', '计算机网络', 'Cookie', 'JWT', 'CORS', '跨域', '认证', '安全', '缓存', '浏览器'],
  },
  {
    name: '计算机基础',
    icon: '💻',
    tags: [
      '计算机基础',
      '二进制',
      '整数',
      '浮点数',
      '十进制',
      '进制转换',
      '十六进制',
      '八进制',
      '原码反码补码',
      'CPU',
      '操作系统',
      'x86',
      'x64',
      '内存',
      'Linux',
    ],
  },
]

interface ProjectLink {
  name: string
  icon: string
  href: string
}

const projectLinks: ProjectLink[] = [
  {
    name: 'Three.js 地球可视化',
    icon: '🗺️',
    href: '/projects/threejs',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['前端技术', '计算机网络']))

  useEffect(() => setMounted(true), [])
  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    const newExpanded = new Set(expanded)
    categoryGroups.forEach((group) => {
      const hasActive = group.tags.some((tag) => {
        const href = `/tags/${slug(tag)}`
        return pathname === href || pathname.startsWith(href + '/')
      })
      if (hasActive) newExpanded.add(group.name)
    })
    setExpanded(newExpanded)
  }, [pathname])

  const toggle = (name: string) => {
    setExpanded((prev) => {
      if (prev.has(name)) return new Set() // 关闭当前
      return new Set([name]) // 只打开这个，收起其他的
    })
  }

  const totalCount = Object.values(tagCounts).reduce((a, b) => a + b, 0)

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
      {/* Logo + Brand */}
      <div className="flex-shrink-0 border-b border-gray-200/40 px-3.5 py-3.5 dark:border-gray-800/40">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 ring-1 ring-cyan-400/30 shadow-lg shadow-cyan-500/10 transition-all duration-500 group-hover:ring-cyan-400/50 group-hover:shadow-xl group-hover:shadow-cyan-500/20 group-hover:scale-105">
            <Logo />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {siteMetadata.headerTitle}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
              <span className="terminal-dot terminal-dot-green" style={{ width: 5, height: 5 }} />
              {siteMetadata.author}
            </div>
          </div>
        </Link>
      </div>

      {/* 分类标题 */}
      <div className="flex-shrink-0 px-3.5 pt-4 pb-0.5">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          博客分类
        </h2>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <ul className="space-y-0.5">
          {/* 全部文章 */}
          <li>
            <Link
              href="/blog"
              className={`
                group flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-300
                ${pathname === '/blog' || pathname.startsWith('/blog/')
                  ? 'bg-accent-50 text-primary-600 dark:bg-accent-950/30 dark:text-primary-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                全部文章
              </span>
              <span className="text-[11px] font-normal tabular-nums text-gray-400 dark:text-gray-500">{totalCount}</span>
            </Link>
          </li>

          {/* 分割线 */}
          <li>
            <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800" />
          </li>

          {/* 分类分组 */}
          {categoryGroups.map((group) => {
            const isOpen = expanded.has(group.name)
            const groupCount = group.tags.reduce((sum, t) => sum + (tagCounts[t] || 0), 0)
            const hasActiveChild = group.tags.some((tag) => {
              const href = `/tags/${slug(tag)}`
              return pathname === href || pathname.startsWith(href + '/')
            })
            return (
              <li key={group.name}>
                <button
                  onClick={() => toggle(group.name)}
                  className={`
                    group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-300
                    ${hasActiveChild && !isOpen
                      ? 'bg-accent-50/60 text-primary-600 dark:bg-accent-950/20 dark:text-primary-400'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <span className="text-sm transition-transform duration-300 group-hover:scale-110">{group.icon}</span>
                  <span className="flex-1 text-left">{group.name}</span>
                  <span className="text-[11px] font-normal tabular-nums text-gray-400 dark:text-gray-500">{groupCount}</span>
                  <svg
                    className={`h-3 w-3 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-90 text-primary-500' : 'group-hover:translate-x-0.5'}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* 子标签 */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="ml-3 mt-0.5 space-y-0 border-l border-gray-200/40 pl-2 pt-0.5 dark:border-gray-800/40">
                    {group.tags.map((t, tagIdx) => {
                      if (!tagCounts[t]) return null
                      const tagSlug = slug(t)
                      const href = `/tags/${tagSlug}`
                      const active = pathname === href || pathname.startsWith(href + '/')
                      return (
                        <li
                          key={t}
                          className="animate-slide-down"
                          style={{ animationDelay: `${tagIdx * 0.03}s` }}
                        >
                          <Link
                            href={href}
                            className={`
                              group flex items-center justify-between rounded-md px-3 py-1.5 text-[12px] transition-all duration-200
                              ${active
                                ? 'bg-accent-50/60 font-medium text-primary-600 dark:bg-accent-950/20 dark:text-primary-400'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800/40 dark:hover:text-gray-300'
                              }
                            `}
                          >
                            <span className="truncate">{t}</span>
                            <span className="ml-1.5 flex-shrink-0 text-[10px] tabular-nums text-gray-400 dark:text-gray-500">
                              {tagCounts[t]}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 项目实战 —— 直接链接 */}
      <div className="flex-shrink-0 px-3.5 pt-1 pb-0.5">
        <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800" />
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1.5">
          项目实战
        </h2>
      </div>
      <nav className="flex-shrink-0 px-2 py-1">
        <ul className="space-y-0.5">
          {projectLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    group flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-300
                    ${active
                      ? 'bg-accent-50 text-primary-600 dark:bg-accent-950/30 dark:text-primary-400'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.name}</span>
                  <svg className="ml-auto h-3 w-3 text-gray-400 transition-all duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 底部 */}
      <div className="flex-shrink-0 border-t border-gray-200/40 px-3.5 py-3 dark:border-gray-800/40">
        <div className="flex flex-wrap gap-2.5">
          {siteMetadata.github && (
            <span className="transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              <SocialIcon kind="github" href={siteMetadata.github} size={4} />
            </span>
          )}
          {siteMetadata.linkedin && (
            <span className="transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={4} />
            </span>
          )}
          {siteMetadata.twitter && (
            <span className="transition-all duration-300 hover:scale-110 hover:-translate-y-0.5">
              <SocialIcon kind="twitter" href={siteMetadata.twitter} size={4} />
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} {siteMetadata.author}
        </p>
      </div>
    </div>
  )

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-52
          border-r border-gray-200/60 transition-all duration-400 ease-in-out
          dark:border-gray-800/60
          lg:static lg:z-0 lg:translate-x-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/20' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`
          fixed top-3 left-3 z-30 rounded-xl glass border border-gray-200/40
          p-2 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105
          dark:border-gray-700/40
          lg:hidden
          ${!mounted ? 'pointer-events-none opacity-0' : ''}
        `}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>
    </>
  )
}
