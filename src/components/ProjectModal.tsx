'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from './Image'
import type { Project } from '@/data/projectsData'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [visible, setVisible] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 挂载后触发入场动画
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    // 禁止页面滚动
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prev
    }
  }, [])

  // 监听容器宽度以计算 iframe 缩放
  useEffect(() => {
    if (!project.previewUrl || !containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    // 初始宽度
    setContainerWidth(containerRef.current.clientWidth)
    return () => observer.disconnect()
  }, [project.previewUrl])

  // 关闭：先触发退场动画，300ms 后真正卸载
  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  const hasPreview = Boolean(project.previewUrl)
  // iframe 内容宽度 1440，高度按 16:9 = 810
  const iframeW = 1440
  const iframeH = 810
  const scale = containerWidth > 0 ? containerWidth / iframeW : 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={handleClose}
    >
      {/* 半透明遮罩 */}
      <div
        className={`absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/80 backdrop-blur transition-all duration-300 hover:bg-white/25 hover:text-white ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="关闭"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 放大内容 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ease-out dark:bg-gray-900 ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* 预览区域 — 真实页面 / 静态图片 */}
        <div
          ref={containerRef}
          className="relative aspect-video w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          {hasPreview && containerWidth > 0 ? (
            <>
              <iframe
                src={project.previewUrl}
                title={`${project.title} 预览`}
                className="border-0"
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
              {/* 加载骨架 */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-8 w-8 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm text-gray-400">加载预览…</span>
                  </div>
                </div>
              )}
            </>
          ) : project.imgSrc ? (
            <Image
              alt={project.title}
              src={project.imgSrc}
              className="h-full w-full object-contain"
              width={1920}
              height={1080}
              priority
            />
          ) : null}
        </div>

        {/* 底部信息 */}
        <div className="shrink-0 overflow-y-auto p-6 sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            {project.title}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {project.description}
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.href && (
            <a
              href={project.href}
              target={project.href.startsWith('http') ? '_blank' : undefined}
              rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600 active:scale-95"
            >
              查看项目
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
