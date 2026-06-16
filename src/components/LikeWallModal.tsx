'use client'

import { useEffect, useState, useRef } from 'react'
import { hasUserLiked, addLike } from '@/utils/postStats'

interface LikeWallModalProps {
  slug: string
}

export default function LikeWallModal({ slug }: LikeWallModalProps) {
  const [show, setShow] = useState(false)
  const [liked, setLiked] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    if (hasUserLiked(slug)) {
      setLiked(true)
      return
    }

    const handleScroll = () => {
      if (triggered.current) return
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      // 滚动超过 40% 触发
      if (scrollPercent > 0.4) {
        triggered.current = true
        setShow(true)
        document.body.style.overflow = 'hidden'
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.style.overflow = ''
    }
  }, [slug])

  const handleLike = () => {
    addLike(slug)
    setLiked(true)
    setShow(false)
    document.body.style.overflow = ''
  }

  const handleCloseModal = () => {
    setShow(false)
    document.body.style.overflow = ''
  }

  if (!show || liked) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-gray-200/60 bg-white p-8 shadow-2xl animate-scale-in dark:border-gray-700/60 dark:bg-gray-900">
        {/* 图标 */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30">
            <svg className="h-8 w-8 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="mb-2 text-center text-lg font-bold text-gray-800 dark:text-gray-100">
          喜欢这篇文章吗？
        </h3>
        <p className="mb-6 text-center text-xs text-gray-400 dark:text-gray-500">
          点个赞解锁完整内容，继续阅读
        </p>

        {/* 按钮 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLike}
            className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-300/40 active:scale-[0.98] dark:shadow-rose-900/30 dark:hover:shadow-rose-800/40"
          >
            ❤️ 点赞并继续阅读
          </button>
          <button
            onClick={handleCloseModal}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            返回文章列表
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-300 dark:text-gray-600">
          点赞后即可解锁全部内容
        </p>
      </div>
    </div>
  )
}
