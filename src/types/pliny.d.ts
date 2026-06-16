import React from 'react'

declare module 'pliny/utils/contentlayer' {
  export function allCoreContent<T>(posts: T[]): T[]
  export function coreContent<T>(post: T): Partial<T>
  export function sortPosts<T extends { date: string }>(posts: T[]): T[]
}

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

declare module 'pliny/mdx-components' {
  import { MDXComponents } from 'mdx/types'
  export function useMDXComponent(code: string, globals?: Record<string, unknown>): React.ComponentType<any>
  export function MDXLayoutRenderer(props: {
    code: string
    components?: MDXComponents
    [key: string]: unknown
  }): JSX.Element
}

declare module 'pliny/newsletter' {
  export function NewsletterAPI(config: { provider?: string }): (req: Request) => Promise<Response>
}

