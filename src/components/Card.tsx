'use client'

import { useState, useRef, useEffect } from 'react'
import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  tags?: string[]
  stats?: string
  /** 真实网页预览 URL，传入后卡片上方会显示 iframe 缩小的真实页面 */
  previewUrl?: string
  onPreviewClick?: () => void
}

/** 计算缩放比例，让 iframe 适配 aspect-video 容器 */
function useIframeScale(containerWidth: number) {
  // 假设目标页面宽度 1440px，容器按比例缩放
  return containerWidth / 1440
}

const Card = ({ title, description, imgSrc, href, tags, stats, previewUrl, onPreviewClick }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    if (!previewUrl || !containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [previewUrl])

  const scale = useIframeScale(containerWidth)
  // iframe 内容宽度 1440，高度按 16:9 = 810
  const iframeW = 1440
  const iframeH = 810

  const hasPreview = Boolean(previewUrl)

  return (
    <article className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/80">
      {/* ====== 封面预览区域 — 真实页面缩小 / 静态图片 ====== */}
      <button
        onClick={onPreviewClick}
        className="relative aspect-video w-full cursor-zoom-in overflow-hidden border-0 bg-gray-100 p-0 dark:bg-gray-800"
        aria-label={`预览 ${title}`}
      >
        {hasPreview ? (
          <>
            {/* 真实页面 iframe，缩小显示 */}
            <div
              ref={containerRef}
              className="absolute inset-0 overflow-hidden"
              style={{ width: '100%', height: '100%' }}
            >
              {containerWidth > 0 && (
                <iframe
                  src={previewUrl}
                  title={`${title} 预览`}
                  className="pointer-events-none border-0"
                  style={{
                    width: iframeW,
                    height: iframeH,
                    transform: `scale(${scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  onLoad={() => setIframeLoaded(true)}
                />
              )}
            </div>
            {/* 加载骨架 */}
            {!iframeLoaded && containerWidth > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-6 w-6 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-xs text-gray-400">加载预览…</span>
                </div>
              </div>
            )}
          </>
        ) : imgSrc ? (
          <Image
            alt={title}
            src={imgSrc}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            width={640}
            height={360}
          />
        ) : null}

        {/* 底部渐变遮罩 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />
        {/* 右下角统计标签 */}
        {stats && (
          <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/45 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            {stats}
          </span>
        )}
        {/* hover 放大图标 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
          </div>
        </div>
      </button>

      {/* ====== 内容区域 ====== */}
      <div className="p-3.5">
        {/* 标题 */}
        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        {/* 描述 */}
        <p className="mb-2.5 line-clamp-1 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
          {description}
        </p>

        {/* 标签列表 */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tags && tags.length > 0 && tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-md bg-gray-100/80 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部操作区 */}
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            aria-label={`查看详情：${title}`}
          >
            查看详情
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  )
}

export default Card
