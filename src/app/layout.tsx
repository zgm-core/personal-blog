import type { Metadata } from 'next'
import { Space_Grotesk, Noto_Serif_SC } from 'next/font/google'
import './globals.css'
import { ThemeProviders } from './theme-providers'
import LayoutShell from '@/components/LayoutShell'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: '墨痕@雨声碎',
    template: '%s | 墨痕@雨声碎',
  },
  description: '记录学习与成长的技术博客',
  icons: {
    icon: [
      { url: '/static/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/static/favicons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/static/favicons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/static/favicons/apple-touch-icon.png',
    other: [
      { rel: 'mask-icon', url: '/static/favicons/safari-pinned-tab.svg', color: '#06b6d4' },
    ],
  },
  manifest: '/static/favicons/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex h-full bg-gray-50 dark:bg-gray-950">
        <ThemeProviders>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProviders>
      </body>
    </html>
  )
}
