'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEmbed = pathname.startsWith('/embed/')

  // 嵌入页面：极简布局，无侧边栏/顶栏/页脚
  // 使用 min-h-screen 而非 h-full，避免 flex 容器中 height:100% 解析失败导致高度为 0
  if (isEmbed) {
    return (
      <div className="flex min-h-screen bg-[#0a0f1a]">
        <main className="relative flex-1 overflow-hidden">{children}</main>
      </div>
    )
  }

  // 正常页面：完整布局
  return (
    <>
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <footer className="border-t border-gray-200/60 bg-white/60 backdrop-blur-sm dark:border-gray-800/60 dark:bg-gray-900/60">
          <div className="mx-auto flex h-10 max-w-5xl items-center justify-between px-4 text-[11px] text-gray-400 dark:text-gray-500 md:px-6 lg:px-8">
            <span>© {new Date().getFullYear()} 墨痕@雨声碎</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </footer>
        <div id="toc-portal" className="pointer-events-auto fixed right-6 top-24 z-20 hidden xl:block" />
      </div>
    </>
  )
}
