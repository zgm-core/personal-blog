'use client'

import { useEffect } from 'react'
import { addView } from '@/utils/postStats'
import LikeWallModal from '@/components/LikeWallModal'

interface ArticleStatsWrapperProps {
  slug: string
  children: React.ReactNode
}

export default function ArticleStatsWrapper({ slug, children }: ArticleStatsWrapperProps) {
  useEffect(() => {
    addView(slug)
  }, [slug])

  return (
    <>
      {children}
      <LikeWallModal slug={slug} />
    </>
  )
}
