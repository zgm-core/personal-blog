'use client'

import type { ComponentType } from 'react'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { components as defaultComponents } from './MDXComponents'

interface MdxRendererProps {
  code: string
  components?: Record<string, ComponentType<any>>
  toc?: unknown
}

export default function MdxRenderer({ code, components }: MdxRendererProps) {
  const MDXContent = useMDXComponent(code)
  const merged = components ? { ...defaultComponents, ...components } : defaultComponents
  return <MDXContent components={merged} />
}
