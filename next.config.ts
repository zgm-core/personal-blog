import type { NextConfig } from 'next'
import { withContentlayer } from 'next-contentlayer2'

const isExport = process.env.EXPORT === '1'
const basePath = process.env.BASE_PATH || undefined

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactCompiler: true,

  // GitHub Pages 静态导出
  ...(isExport ? { output: 'export', distDir: 'dist' } : {}),

  // GitHub Pages basePath（如 /personal-blog）
  basePath,

  // 移除 X-Powered-By 头，减少信息泄漏
  poweredByHeader: false,

  // gzip/brotli 压缩（生产环境默认启用）
  compress: true,

  // 生产环境移除 console 日志（保留 error）
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // 图片优化（静态导出时关闭优化）
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    ...(isExport && process.env.UNOPTIMIZED ? { unoptimized: true } : {}),
  },

  // 安全头 + 静态资源缓存
  async headers() {
    const headers = [
      {
        source: '/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/threejs/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/favicon.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ]
    // 安全头（GitHub Pages 静态托管时无效，保留用于自部署场景）
    if (isExport) {
      headers.unshift({ source: '/(.*)', headers: securityHeaders })
    }
    return headers
  },

  // 优化包导入（tree-shaking）
  experimental: {
    optimizePackageImports: ['three', 'd3'],
  },

  // Turbopack
  turbopack: {},
}

export default withContentlayer(nextConfig)
