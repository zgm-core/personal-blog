import type { ComponentType } from 'react'
import TOCInline from '@/components/pliny/TOCInline'
import Pre from '@/components/pliny/Pre'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

export const components: Record<string, ComponentType<any>> = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
}
