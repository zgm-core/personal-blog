import type { Metadata } from 'next'
import ClientLayout from './ClientLayout'

export const metadata: Metadata = {
  title: 'Three.js 地球可视化',
  description: '25 个 Three.js 交互式 Demo，涵盖地球可视化、飞线效果、数据映射等技术',
}

export default function ThreejsLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
