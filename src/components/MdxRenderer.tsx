'use client'

import { useMDXComponent } from 'next-contentlayer2/hooks'
import type { MDXComponents } from 'mdx/types'
import { components as defaultComponents } from './MDXComponents'

interface MdxRendererProps {
  code: string
  components?: MDXComponents
  toc?: unknown
}

export default function MdxRenderer({ code, components }: MdxRendererProps) {
  const MDXContent = useMDXComponent(code)
  const merged = components ? { ...defaultComponents, ...components } : defaultComponents
  return <MDXContent components={merged} />
}
