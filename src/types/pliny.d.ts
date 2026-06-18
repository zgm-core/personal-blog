import React from 'react'

declare module 'pliny/mdx-plugins/index.js' {
  export function remarkExtractFrontmatter(): any
  export function remarkCodeTitles(): any
  export function remarkImgToJsx(): any
  export function extractTocHeadings(content: string): any[]
}

declare module 'pliny/search' {
  import { ReactNode } from 'react'
  export interface SearchConfig {
    provider: string
    kbarConfig?: {
      searchDocumentsPath: string
      [key: string]: unknown
    }
    algoliaConfig?: Record<string, unknown>
  }
  export function SearchProvider(props: { searchConfig: SearchConfig; children: ReactNode }): JSX.Element
}

declare module 'pliny/analytics' {
  import { ReactNode } from 'react'
  export interface AnalyticsConfig {
    [key: string]: unknown
  }
  export function Analytics(props: { analyticsConfig: AnalyticsConfig }): JSX.Element
}

