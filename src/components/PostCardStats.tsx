'use client'

import { useState, useEffect } from 'react'
import { getLikes, getViews, toggleLike, addView } from '@/utils/postStats'

interface PostCardStatsProps {
  slug: string
  compact?: boolean
}

export default function PostCardStats({ slug, compact }: PostCardStatsProps) {
  const [likes, setLikes] = useState(0)
  const [views, setViews] = useState(0)
  const [liked, setLiked] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setLikes(getLikes(slug))
    setViews(getViews(slug))
  }, [slug])

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const result = toggleLike(slug)
    setLiked(result.liked)
    setLikes(result.count)
    if (result.liked) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 600)
    }
  }

  const handleView = (e: React.MouseEvent) => {
    // views are tracked on article page, not on card click
    e.preventDefault()
    e.stopPropagation()
    const newViews = addView(slug)
    setViews(newViews)
  }

  const size = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
  const textSize = compact ? 'text-[10px]' : 'text-[11px]'

  return (
    <div className={`inline-flex items-center gap-3 ${textSize} text-gray-400 dark:text-gray-500`}>
      {/* 点赞 */}
      <button
        onClick={handleLike}
        className={`inline-flex items-center gap-1 transition-all duration-300 ${
          liked
            ? 'text-rose-500 dark:text-rose-400'
            : 'hover:text-rose-400 dark:hover:text-rose-400'
        }`}
      >
        <svg
          className={`${size} transition-all duration-300 ${liked ? 'scale-110 fill-current' : ''} ${animating ? 'animate-bounce' : ''}`}
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={liked ? 0 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <span className="tabular-nums">{likes}</span>
      </button>

      {/* 访问量 */}
      <span className="inline-flex items-center gap-1">
        <svg className={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span className="tabular-nums">{views}</span>
      </span>
    </div>
  )
}
