'use client'

import Giscus, { type GiscusProps } from '@giscus/react'
import type { Mapping, BooleanString, InputPosition, Theme } from '@giscus/react'

interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping: Mapping
  reactions: BooleanString
  metadata: BooleanString
  theme: Theme
  darkTheme: Theme
  themeURL: string
  lang: string
  inputPosition?: InputPosition
}

interface CommentsProps {
  commentsConfig: {
    provider: string
    giscusConfig: GiscusConfig
  }
  slug?: string
}

export default function Comments({ commentsConfig, slug: _slug }: CommentsProps) {
  if (commentsConfig.provider !== 'giscus') return null
  return <Giscus {...commentsConfig.giscusConfig as GiscusProps} />
}
